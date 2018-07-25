app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService, dashboardService, $interval, $window, $mdSidenav) {
  		var vm = this;

        vm.searchID = "";
        vm.previousTree = [];

        init();

        vm.selectData = function(data){
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
        }

        //function to filter data menu using search ID
        vm.filter = function(){
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
                $window.alert("No match found!");
                vm.dataTree = angular.copy(vm.previousTree);
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
                        if(!angular.equals(tree, vm.previousTree)){
                            vm.previousTree = angular.copy(tree);
                            vm.dataTree = angular.copy(tree);
                        }
                    } else {
                        vm.dataTree = [];
                        vm.previousTree = angular.copy(vm.dataTree);
                        //$window.alert("No telemetry data for the current mission. Please close the sidebar!");
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
