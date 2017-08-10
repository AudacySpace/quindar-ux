app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService, dashboardService, $scope, $interval) {
  		var vm = this;

        vm.searchID = "";
        var previousTree = [];

        getData();

        vm.selectData = function(data){
            if(data.nodes.length == 0){
                sidebarService.setVehicleInfo(data.value);
            } else {
                data.active = !data.active;
            }
        }

        //function to filter data menu using search ID
        vm.filter = function(){
            //copy the data menu pulled from configuration
            vm.dataTree = angular.copy(previousTree);

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
                alert("No match found!");
                vm.dataTree = angular.copy(previousTree);
            }
        }

        //get the configuration contents from database
        function getData(){
            var interval = $interval(function(){
                var currentMission = dashboardService.getCurrentMission();
                if(currentMission.missionName != ""){
                    dashboardService.getConfig(currentMission.missionName)
                    .then(function(response) {
                        if(response.data) {
                            vm.dataTree = getDataTree(response.data);
                            previousTree = angular.copy(vm.dataTree);
                        }
                    });
                    $interval.cancel(interval);
                }
            }, 1000);
        }

        //recursive function to create the tree structure data
        function getDataTree(data, cKey){
            var tree = [];
            for(var key in data) {
                if(data.hasOwnProperty(key)) {
                    var nodes = [];
                    var newKey = (cKey ? cKey + "." + key : key);

                    if(typeof data[key] === 'object'){
                        nodes = getDataTree(data[key], newKey);
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
	}
});
