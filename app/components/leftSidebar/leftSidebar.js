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
                        var tree = dashboardService.getDataTree(vm.telemetry.data);
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
    }
});
