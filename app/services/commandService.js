app
.factory('commandService', ['$http', function($http) { 
    function saveCommand(email, command, mission){
        return $http({
            url: "/saveCommand", 
            method: "POST",
            data: {"email" : email, "command" : command, "mission": mission}
        })
    }

    function getCommandLog(mission){
        return $http({
            url: "/getCommandLog", 
            method: "GET",
            params: {"mission": mission}
        });
    }

    function getCommandList(mission){
        return $http({
            url: "/getCommandList", 
            method: "GET",
            params: {"mission": mission}
        });
    }
    
	return {
        saveCommand : saveCommand,
        getCommandLog : getCommandLog,
        getCommandList : getCommandList
	}
}]);
