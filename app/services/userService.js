app
.factory('userService', ['$http', '$window', function($http, $window) { 
    var userRole = {
        cRole : $window.user.currentRole
    };

    function getUserName() {
        if($window.user.google && $window.user.google.name) {
            return $window.user.google.name;
        } else {
            return "";
        }
    }

    function getUserEmail() {
        if($window.user.google && $window.user.google.email) {
            return $window.user.google.email;
        } else {
            return "";
        }
    }

    function getCurrentRole(mission) {
        return $http({
            url: "/getCurrentRole", 
            method: "GET",
            params: {"email": $window.user.google.email, "mission" : mission}
        });
    }

    function getAllowedRoles(mission) {
        return $http({
            url: "/getAllowedRoles", 
            method: "GET",
            params: {"email": $window.user.google.email, "mission" : mission}
        });      
    }

    function setCurrentRole(role, mission) {
        userRole.cRole = role;
        var email = getUserEmail();
        return $http({
            url: "/setUserRole", 
            method: "POST",
            data: {"email" : email, "role" : role, "mission" : mission}
        });
    }

    function getUsers(mission) {
        return $http({
            url: "/getUsers",
            method: "GET",
            params: { "mission" : mission }
        });
    }

    function getRoles() {
        return $http({
                url: "/getRoles", 
                method: "GET"
            });
    }

    function setAllowedRoles(user, roles, mission) {
        return $http({
            url: "/setAllowedRoles", 
            method: "POST",
            data: {"email" : user.google.email, "roles" : roles, "mission": mission}
        });
    }

    //set mission name for user
    function setMissionForUser(email, mission) {
        return $http({
            url: "/setMissionForUser",
            method: "POST",
            data: {"email" : email, "mission" : mission}
        });
    }
    
	return {
        userRole : userRole,
        getUserName : getUserName,
        getUserEmail : getUserEmail,
        getCurrentCallSign : getCurrentCallSign,
        getCurrentRole : getCurrentRole,
        getAllowedRoles : getAllowedRoles,
        setCurrentRole : setCurrentRole,
        getUsers : getUsers,
        getRoles : getRoles,
        setAllowedRoles : setAllowedRoles,
        setMissionForUser : setMissionForUser
	}
}]);
