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

    function getCommand(mission){
        return $http({
            url: "/getCommand",
            method: "GET",
            params: {"mission": mission}
        });
    }

    function lockCommand(mission){
        return $http({
            url: "/lockCommand",
            method: "POST",
            data: {"mission": mission}
        })
    }

    function sendCommand(mission, timestamp){
        return $http({
            url: "/sendCommand",
            method: "POST",
            data: {"mission": mission, "timestamp" : timestamp}
        })
    }

    function removeCommand(mission){
        return $http({
            url: "/removeCommand",
            method: "POST",
            data: {"mission": mission}
        })
    }
    
	return {
        saveCommand : saveCommand,
        getCommandLog : getCommandLog,
        getCommandList : getCommandList,
        getCommand : getCommand,
        lockCommand : lockCommand,
        sendCommand : sendCommand,
        removeCommand : removeCommand
	}
}]);
