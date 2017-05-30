app
.factory('userService', ['$http', function($http) { 

    function getUserName() {
        if(user.google && user.google.name) {
            return user.google.name;
        } else {
            return "";
        }
    }

    function getUserEmail() {
        if(user.google && user.google.email) {
            return user.google.email;
        } else {
            return "";
        }
    }

    function getCurrentCallSign() {
        if(user.currentRole && user.currentRole.callsign) {
            return user.currentRole.callsign;
        } else {
            return "";
        }
    }

    function getCurrentRole() {
        if(user.currentRole) {
            return user.currentRole;
        } else {
            return "";
        }
    }

    function getAllowedRoles() {
        if(user.allowedRoles) {
            return user.allowedRoles;
        } else {
            return "";
        }        
    }

    function setCurrentRole(role) {
        var email = getUserEmail();
        return $http({
            url: "/setUserRole", 
            method: "POST",
            data: {"email" : email, "role" : role}
        });
    }
    
	return {
        getUserName : getUserName,
        getUserEmail : getUserEmail,
        getCurrentCallSign : getCurrentCallSign,
        getCurrentRole : getCurrentRole,
        getAllowedRoles : getAllowedRoles,
        setCurrentRole : setCurrentRole
	}
}]);