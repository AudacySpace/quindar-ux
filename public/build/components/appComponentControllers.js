angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService,gridService, sidebarService, $interval,$mdSidenav,$window, userService, $uibModal,$mdDialog,prompt) {
  		var vm = this;

		vm.clock = {
			utc : "000.00.00.00 UTC"
		}
		vm.locks = dashboardService.getLock();
		vm.telemetry = dashboardService.telemetry;
		vm.name = userService.getUserName();
		vm.email = userService.getUserEmail();
		vm.role = userService.userRole;
		var dashboard = gridService.getDashboard();
		var totalMissions = [];

  		vm.currentMission =  dashboardService.getCurrentMission();

  		vm.updateClock = function(){
  			vm.clock = dashboardService.getTime('UTC');
  		}

  		vm.interval = $interval(vm.updateClock, 500);

	    vm.openLeftNav = function(){
	    	if ($window.innerWidth <= 1440){
	    		$mdSidenav('left').open();
	    	} else {
	    		vm.locks.lockLeft = !vm.locks.lockLeft;
	    		dashboardService.setLeftLock(vm.locks.lockLeft); 
	    	}
			sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
			sidebarService.setOpenLogo(true); //set to true if data menu opened through Quindar logo on Dashboard
	    }

	    vm.logout = function (ev) {
    		prompt({
                title:'Do you want to save this layout?',
                input: true,
                label: 'Layout Name',
                value: dashboard["current"].name
            }).then(function(name){
                gridService.save(vm.email, name)
                .then(function(response) {
                    if(response.status == 200){
                        $window.location.href = '/logout';
                    }
                });
            },function(){
            	$window.location.href = '/logout';
            }).catch(function (err) {});
        };

	    vm.openRightNav = function(){
	    	if ($window.innerWidth <= 1440){
	    		$mdSidenav('right').open();
	    	} else {
	    		vm.locks.lockRight = !vm.locks.lockRight;
	    		dashboardService.setRightLock(vm.locks.lockRight); 
	    	}
	    }

	    vm.showSettings = function(){
			$uibModal.open({
				templateUrl: './components/dashboard/roleModal.html',
				controller: 'modalCtrl',
				controllerAs: '$ctrl',
                resolve: {
                    mission: function () {
                        return dashboardService.getCurrentMission();
                    }
                }
			}).result.then(function(response){
				if(response) {
					//vm.callsign = response.callsign;
				}
			},
			function () {
				//console.log('Modal dismissed');
      		});
	    }
	}
})

app.controller('modalCtrl',['$uibModalInstance', 'userService', 'mission', '$window','$mdDialog', function($uibModalInstance, userService, mission, $window,$mdDialog) {
	var $ctrl = this;

	$ctrl.cRole = {};

	userService.getCurrentRole(mission.missionName)
	.then(function(response) {
		if(response.status == 200){
			$ctrl.cRole = angular.copy(response.data);
			$ctrl.role = {
				currentRole:$ctrl.cRole
			};
		}
	});

	$ctrl.close = function() {
		$uibModalInstance.dismiss('cancel'); 
	};


	userService.getAllowedRoles(mission.missionName)
	.then(function(response) {
		if(response.status == 200){
			$ctrl.roles = response.data;
		}
	});

	$ctrl.updateRole = function(ev){
		if($ctrl.cRole.callsign === 'MD' && $ctrl.role.currentRole.name !== 'Mission Director') {
			//$window.alert("No mission without the Mission Director. Your role cannot be updated!");
			$uibModalInstance.close($ctrl.cRole);
		} else {
			userService.getRoles()
    		.then(function(response) {
        		if(response.status == 200) {
        			for(var a in response.data.roles){
        				if(response.data.roles[a].name === $ctrl.role.currentRole.name){
        					$ctrl.role.currentRole.callsign = response.data.roles[a].callsign;
        					break;
        				}
        			}
       				userService.setCurrentRole($ctrl.role.currentRole, mission.missionName)
	        		.then(function(response) {
	        			if(response.status == 200){
	                		//$window.alert("User's current role updated.");
	                		$uibModalInstance.close($ctrl.role.currentRole);
	            		}else {
	            			$window.alert("An error occurred.User's role not updated!");
	            		}
	        		});
        		}
    		});
	    }
    }
}]);

app.controller('missionModalCtrl',['$uibModalInstance','dashboardService','$scope','$window', function($uibModalInstance,dashboardService,$scope,$window) {
	var $ctrl = this;
	$scope.missions = dashboardService.missions;
	$ctrl.currentMission = {};
	$ctrl.missionName = ''; 
	$scope.$watch("missions",function(newVal,oldVal){
		$ctrl.missions = newVal;
	},true);

	//save mission and close modal 
	$ctrl.setMission = function(){
		var numOfMissions = $scope.missions.length;
		for(var i=0;i<numOfMissions;i++){
			if($ctrl.missionName === $scope.missions[i].missionName){
				$ctrl.currentMission = angular.copy($scope.missions[i]);
				if(dashboardService.isEmpty($ctrl.currentMission) === false){
					dashboardService.setCurrentMission($ctrl.currentMission);
	    			$uibModalInstance.close($ctrl.currentMission);
	    			break;
	    		}
			}
		}  
	}
}]);

app
.component('deleteMenu', {
	bindings: {
    	widget: '='
    },
    templateUrl: "../components/deleteMenu/delete.html",
    controller: function(gridService){
    	var vm = this;

		vm.deleteWidget = function(widget) {
			gridService.remove(widget);
		};

		vm.closedeleteWidget = function(widget){
			widget.main = true;
			widget.settings.active = false;
			widget.saveLoad = false;			
			widget.delete = false;			
		}
    }
})
app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService, dashboardService, $interval, $window, $mdSidenav,$mdToast,$scope) {
  		var vm = this;

        vm.searchID = "";
        vm.previousTree = [];
        vm.noresultsmsg = "";

        init();

        vm.selectData = function(data){
            var openStatus = sidebarService.getOpenLogo();
            if(!openStatus){
                //if opened through a qwidget
                if(data.nodes.length == 0){
                    sidebarService.setVehicleInfo(data.value);
                } else {
                    var nodes = data.nodes;
                    var count = 0;
                    for(var i=0; i<nodes.length; i++){
                        if(nodes[i].nodes.length > 0){
                            count = count + 1;
                        }
                    }

                    //if parent of leaf node, count will be 0
                    if(count==0){
                        sidebarService.setVehicleInfo(data.value);
                    } else {
                        sidebarService.setVehicleInfo("");
                    }
                    data.active = !data.active;
                }
            } else {
                //if opened through the Quindar Logo
                if(data.nodes.length != 0){
                    data.active = !data.active;
                }
            }
        }

        //function to filter data menu using search ID
        vm.filter = function(keyEvent){
            if (keyEvent.which === 13 || keyEvent.type === "click"){ // when "enter" key is pressed
                //copy the data menu pulled from configuration
                vm.dataTree = angular.copy(vm.previousTree);

                vm.dataTree = vm.dataTree.filter(function f(data) {
                    var name = data.name.toLowerCase();
                    var searchID = vm.searchID.toLowerCase();
                
                    if (name.includes(searchID)) return true;

                    if (data.nodes) {
                        data.nodes = data.nodes.filter(f);
                        if(data.nodes.length){
                            data.active = !data.active;
                        }
                        return data.nodes.length;
                    }
                });

                if(vm.dataTree.length == 0){
                    vm.noresultsmsg = "No results found for "+vm.searchID+" !";
                    vm.searchID = "";
                }
            }
        }

        function init(){
            //interval to check for left sidebar, if opened, then construct the tree
            vm.interval = $interval(function(){
                var locks = dashboardService.getLock();
                var menuStatus = sidebarService.getMenuStatus();
                //check if left menu is open and data menu has not been constructed yet
                if((locks.lockLeft || $mdSidenav('left').isOpen()) && menuStatus){
                    vm.telemetry = dashboardService.getTelemetryValues();
                    if(vm.telemetry.hasOwnProperty('data')){
                        //create data tree from incoming telemetry
                        var tree = getDataTree(vm.telemetry.data);
                        vm.dataloading = false;
                        if(!angular.equals(tree, vm.previousTree)){
                            vm.previousTree = angular.copy(tree);
                            vm.dataTree = angular.copy(tree);
                        }

                        // code to reset data tree if search id is removed
                        if(vm.searchID.length === 0 && vm.noresultsmsg.includes("No results found")){
                            vm.noresultsmsg = "";
                            vm.previousTree = angular.copy(tree);
                            vm.dataTree = angular.copy(tree);
                            vm.dataloading = false;
                        }
                      
                    } else {
                        vm.dataTree = [];
                        vm.previousTree = angular.copy(vm.dataTree);
                        vm.noresultsmsg = "No Data available";
                        vm.dataloading = false;

                        if(vm.searchID.length === 0 && vm.noresultsmsg.includes("No results found")){
                            vm.noresultsmsg = "";
                            vm.dataTree = [];
                            vm.previousTree = angular.copy(vm.dataTree);
                            vm.dataloading = false;
                        }
                    }
                    sidebarService.setMenuStatus(false); //set to false when above has been executed
                }
            }, 1000);
        }

        //recursive function to create the tree structure data
        function getDataTree(data, cKey){
            var tree = [];
            for(var key in data) {
                if(data.hasOwnProperty(key)) {
                    var nodes = [];
                    var flag = true;
                    var newKey = (cKey ? cKey + "." + key : key);

                    var node = {
                        value: "",
                        key: ""
                    }

                    if(typeof data[key] === 'object'){
                        for(var key2 in data[key]) {
                            if(data[key].hasOwnProperty(key2)) {
                                //if not an object, then maybe the last nodes(metadata) 
                                //like value, units etc. and need not be there in the 
                                //data menu
                                if(typeof data[key][key2] !== 'object'){
                                    flag=false;
                                    break;
                                }
                            }
                        }

                        if(flag){
                            nodes = getDataTree(data[key], newKey);
                        }
                    }

                    if(nodes.length != 0) {
                        key = initCaps(key);
                    }

                    var node = {
                        'name' : key,
                        'nodes' : nodes,
                        'value' : newKey,
                        'active' : false
                    };

                    tree.push(node);
                }
            }

            //sort the tree based on the name property of the objects inside it
            tree.sort(function(a, b){
                var nameA = a.name;
                var nameB = b.name;
                if (nameA < nameB) //sort string ascending
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0;
            })

            return tree;
        }

        //function to capitalise the first letter of a string
        function initCaps(str){
            words = str.split(' ');

            for(var i = 0; i < words.length; i++) {
                var letters = words[i].split('');
                letters[0] = letters[0].toUpperCase();
                words[i] = letters.join('');
            }
            return words.join(' ');
        }
    }
});

angular.module('app')
.component('grid', {
    templateUrl: "../components/grid/grid.html",
    controller: function(gridService,dashboardService){
    	var vm = this;
		vm.gridsterOptions = gridService.gridsterOptions;
	   	vm.dashboard = gridService.getDashboard();
	   	vm.loadStatus = dashboardService.getLoadStatus();
	   	vm.loadLayoutloaders = gridService.getGridLoader();

		vm.remove = function(widget) {
			widget.main = false;
			widget.settings.active = false;
			widget.saveLoad = false;
			widget.delete = true;
		};

		vm.openSettings = function(widget) {
			widget.main = false;
			widget.settings.active = true;
			widget.saveLoad = false;		
			widget.delete = false;
		};

		vm.openSaveLoadSettings = function(widget) {
			widget.main = false;
			widget.settings.active = false;
			widget.saveLoad = true;
			widget.delete = false;			
		};
    }
})

app
.component('saveMenu', {
	bindings: {
    	widget: '='
    },
    templateUrl: "../components/saveMenu/save.html",
    controller: function(){
    	var vm = this;

		vm.closeSaveLoadSettings = function(widget){
			widget.main = true;
			widget.settings.active = false;
			widget.saveLoad = false;
			widget.delete = false;
		}
    }
})
angular.module('app')
.component('statusIcons', {
  	templateUrl: "./components/statusIcons/status_icons.html",
  	controller: function(dashboardService,$scope) {
  		var vm = this;
  		vm.satstatusIconColor = "#12C700";//satellite icon default color
  		vm.gsstatusIconColor = "#12C700";//ground station icon default color
  		vm.proxystatusIconColor = "#12C700";//proxy icon default color
  		vm.dbstatusIconColor = "#12C700";//database icon default color
  		$scope.statusIcons = dashboardService.icons;
  		var dServiceObj = {};

  		$scope.$watch('statusIcons',function(newVal,oldVal){
        	dServiceObj = newVal; 
        	if(dServiceObj.sIcon === "grey" && dServiceObj.gIcon === "grey" && dServiceObj.pIcon === "grey" &&dServiceObj.dIcon === "red"){
				//if query failed
				vm.satstatusIconColor = "#CFCFD5";
				vm.gsstatusIconColor = "#CFCFD5";
				vm.proxystatusIconColor = "#CFCFD5";
  				vm.dbstatusIconColor = "#FF0000";
	    	}else if(dServiceObj.sIcon === "grey" && dServiceObj.gIcon === "red" && dServiceObj.pIcon=== "green" && dServiceObj.dIcon === "blue"){
	    		// if there is response from database but the data is stale
	    		// or if proxy application is not receiving any data from ground station
	    		vm.satstatusIconColor = "#CFCFD5";
  				vm.gsstatusIconColor = "#FF0000";
  				vm.proxystatusIconColor = "#12C700";
  				vm.dbstatusIconColor = "#71A5BC";
	    	}else if(dServiceObj.sIcon === "red" && dServiceObj.gIcon === "green" && dServiceObj.pIcon=== "green" && dServiceObj.dIcon === "green"){
	    		//if the streamed data is empty
	    		vm.satstatusIconColor = "#FF0000";
  				vm.gsstatusIconColor = "#12C700";
  				vm.proxystatusIconColor = "#12C700";
  				vm.dbstatusIconColor = "#12C700";
	    	}else if(dServiceObj.sIcon === "grey" && dServiceObj.gIcon === "grey" && dServiceObj.pIcon === "red" && dServiceObj.dIcon === "green"){
	    		//If proxy application is not running
	    		vm.satstatusIconColor = "#CFCFD5";
  				vm.gsstatusIconColor = "#CFCFD5";
  				vm.proxystatusIconColor = "#FF0000";
  				vm.dbstatusIconColor = "#12C700";
	    	}else if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
	    		//If everything works good
	    		vm.satstatusIconColor = "#12C700";
  				vm.gsstatusIconColor = "#12C700";
  				vm.proxystatusIconColor = "#12C700";
  				vm.dbstatusIconColor = "#12C700";
	    	}
    	},true);
	}
})
app
.component('rightSidebar', {
  	templateUrl: "./components/rightSidebar/right_sidebar.html",
  	controller: function(gridService, dashboardService, prompt, $window, $mdSidenav, userService, $uibModal, $mdDialog) {
        var vm = this;
  		vm.name = userService.getUserName();
        vm.email = userService.getUserEmail();
        var dashboard = gridService.getDashboard();
        getUserRole();

        vm.addWidget = function() {
            gridService.addWidget();
        };

        vm.clear = function() {
            gridService.clear();
        };

        vm.addWidgets = function(widget) {
            gridService.addWidgets(widget);
        };

        vm.widgetDefinitions = gridService.widgetDefinitions;
        vm.QwidgetMenu =  false;
        vm.addMenu = false;

        vm.showQwidgetMenu = function(){
            vm.QwidgetMenu = !vm.QwidgetMenu;
        }

        vm.showAddMenu = function(){
            vm.addMenu = !vm.addMenu;
        }

        vm.save = function(ev){
            prompt({
                title: 'Save Layout',
                input: true,
                label: 'Layout Name',
                value: dashboard["current"].name
            }).then(function(name){
                gridService.save(vm.email, name)
                .then(function(response) {
                    if(response.status == 200){
                        $window.document.title = "Quindar - " + name;
                    }
                });
            }).catch(function (err) {});
        }

        vm.load = function(){
            gridService.load(vm.email)
            .then(function(response) {
                vm.layouts = response.data;
                vm.layoutMenu = !vm.layoutMenu;
            },function(err){

            });
        }

        vm.showLayout = function(layout){
            gridService.setGridLoader(true);
            dashboardService.setLoadStatus(false);
            gridService.showLayout(vm.layouts, layout);
            $window.document.title = "Quindar - " + layout.name;
			closeSidebar();
        }
		
		vm.showDoc = function(){
            vm.Doc = !vm.Doc;
		}

		vm.showReadme = function() {

			// Just provide a template url, a controller and call 'open'.
            $uibModal.open({
                templateUrl: "./components/rightSidebar/documentation.html",
                controller: 'docController'
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
			closeSidebar();	
		};
		
		vm.showContributing = function() {

			// Just provide a template url, a controller and call 'open'.
            $uibModal.open({
                templateUrl: "./components/rightSidebar/contributing.html",
                controller: 'docController'
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
			closeSidebar();		
		};

        vm.showAdminModal = function() {
            closeSidebar();

            $uibModal.open({
                templateUrl: './components/rightSidebar/adminModal.html',
                controller: 'adminCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    mission: function () {
                        return dashboardService.getCurrentMission();
                    }
                }
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
        }
		
		function closeSidebar(){
			if ($window.innerWidth <= 1440){
				$mdSidenav('right').close();
            } else {
                var locks = dashboardService.getLock();
                locks.lockRight = !locks.lockRight;
                dashboardService.setRightLock(locks.lockRight); 
            }
		}

        function getUserRole() {
            if ($window.innerWidth <= 768){
                vm.userRole = {
                    cRole : {
                        "name": "Observer",
                        "callsign": "VIP"
                    }
                };
            } else {
                vm.userRole = userService.userRole;
            }
        }
	}
})

app.controller('docController', ['$scope','$uibModalInstance', function($scope,$uibModalInstance) {
	
    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

}]);

app.controller('adminCtrl',['$scope', '$filter', '$uibModalInstance', 'userService', 'mission', '$window', function($scope, $filter, $uibModalInstance, userService, mission, $window) {
    var $ctrl = this;

    $ctrl.users = [];
    $ctrl.roles = [];
    $ctrl.mission = mission.missionName;
    $scope.saveSuccess = false;

    userService.getRoles()
    .then(function(response) {
        if(response.status == 200) {
            var roles = response.data.roles;
            for (var role in roles){
                if (!roles.hasOwnProperty(role)) continue;

                roles[role].checked = false;

                if(role != 'MD') {
                    $ctrl.roles.push(roles[role]);
                }
            }
        }
    });

    userService.getUsers($ctrl.mission)
    .then(function(response) {
        if(response.status == 200) {
            var users = response.data;
            for (var i=0; i<users.length; i++){
                if(users[i].currentRole && users[i].currentRole.callsign != 'MD') {
                    $ctrl.users.push(users[i]);
                }
            }
        }
    });

    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function() {
        if($ctrl.selected){
            if(roleChosen()){
                var newRoles = [];
                var objRoles = {};
                 
                for (var i=0; i<$ctrl.roles.length; i++){
                    if($ctrl.roles[i].checked == true) {
                        var newRole = new Object();
                        newRole.name = $ctrl.roles[i].name;
                        newRole.callsign = $ctrl.roles[i].callsign;
                        newRoles.push(newRole);
                        objRoles[$ctrl.roles[i].callsign] = 1;
                    }
                }

                $ctrl.selected.user.allowedRoles = objRoles;

                userService.setAllowedRoles($ctrl.selected.user, newRoles, $ctrl.mission)
                .then(function(response) {
                    if(response.status == 200){
                        $scope.saveSuccess = true;
                        $scope.successMessage = "Success! Roles updated for user: "+ $ctrl.selected.user.google.name;
                    }
                })
            } else {
                $window.alert("Please choose at least one role");
            }
        } else {
            $window.alert("Please select the user from dropdown menu");
        }
    }

    $scope.$watch('$ctrl.selected.user', function(newValue, oldValue){
        for(var i=0; i<$ctrl.roles.length; i++) {
            if($ctrl.selected.user.allowedRoles) {
                if($ctrl.roles[i].callsign in $ctrl.selected.user.allowedRoles){
                    $ctrl.roles[i].checked = true;
                } else {
                     $ctrl.roles[i].checked = false;
                }
            }
        }
    })

    function roleChosen() {
        var trues = $filter("filter")($ctrl.roles, {
            checked: true
        });
        return trues.length;
    }

    $ctrl.resetSuccessMessage = function(){
        $scope.saveSuccess = false;
        $scope.successMessage = "";
    }

}]);
