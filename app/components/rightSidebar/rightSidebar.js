app
.component('rightSidebar', {
  	templateUrl: "./components/rightSidebar/right_sidebar.html",
  	controller: function(gridService, dashboardService, prompt, $window, $mdSidenav, userService, $uibModal) {
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

        vm.save = function(){
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
                        var position = "bottom right";
                        var queryId = '';
                        var delay = false;
                        var usermessage = "Layout: "+name+" saved succcessfully.";
                        var alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay); 
                    }
                });
            });
        }

        vm.load = function(){
            gridService.load(vm.email)
            .then(function(response) {
                vm.layouts = response.data;
                vm.layoutMenu = !vm.layoutMenu;
            })
        }

        vm.showLayout = function(layout){
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
			if ($window.innerWidth < 1400){
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

app.controller('adminCtrl', function($scope, $filter, $uibModalInstance, userService, mission, $window,dashboardService) {
    var $ctrl = this;

    $ctrl.users = [];
    $ctrl.roles = [];
    $ctrl.mission = mission.missionName;

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
        var position,queryId,delay,usermessage,alertstatus;
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
                        position = "bottom right";
                        queryId = '#allowedrolestoaster';
                        delay = 5000;
                        usermessage = "Allowed roles updated for " + $ctrl.selected.user.google.name +"!";
                        alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay); 
                    }
                })
            } else {
                position = "bottom right";
                queryId = '#allowedrolestoaster';
                delay = false;
                usermessage = "Please choose at least one role.";
                alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay); 
            }
        } else {
            position = "bottom right";
            queryId = '#allowedrolestoaster';
            delay = false;
            usermessage = "Please select the user from dropdown menu.";
            alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay); 
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

});
