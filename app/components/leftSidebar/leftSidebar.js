app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService, dashboardService, $interval, $window, gridService) {
  		var vm = this;
        vm.telemetry = dashboardService.telemetry;
        vm.previousTelemetry = {};

        vm.searchID = "";
        vm.previousTree = [];

        getData();

        vm.selectData = function(data){
            if(data.nodes.length == 0){
                sidebarService.setVehicleInfo(data.value, gridService.getDashboard());
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
                    sidebarService.setVehicleInfo(data.value, gridService.getDashboard());
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

        //get the contents from the incoming telemetry stream
        function getData(){
            //interval to check for updated telemetry each second
            vm.interval = $interval(function(){
                if(vm.telemetry){
                    //merge the current telemetry object with the previous telemetry object
                    vm.telemetryMerged = angular.merge({}, vm.telemetry, vm.previousTelemetry);

                    //create a data tree only if there is a mismatch between previous telemetry and new one
                    if(!angular.equals(vm.telemetryMerged, vm.previousTelemetry)) {
                        vm.dataTree = getDataTree(vm.telemetryMerged.data)

                        vm.previousTelemetry = angular.copy(vm.telemetryMerged);
                        vm.previousTree = angular.copy(vm.dataTree);
                    }
                } else {
                    vm.dataTree = angular.copy(vm.previousTree);
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

                    tree.push(node)
                }
            }
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

        vm.$onDestroy = function(event) {
            $interval.cancel(vm.interval );
        }
	}
});
