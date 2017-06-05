app
.factory('userService', ['$http', function($http) { 
    var userRole = {
        cRole : user.currentRole
    };

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
        return $http({
            url: "/getCurrentRole", 
            method: "GET",
            params: {"email": user.google.email}
        });
    }

    function getAllowedRoles() {
        return $http({
            url: "/getAllowedRoles", 
            method: "GET",
            params: {"email": user.google.email}
        });      
    }

    function setCurrentRole(role) {
        userRole.cRole = role;
        var email = getUserEmail();
        return $http({
            url: "/setUserRole", 
            method: "POST",
            data: {"email" : email, "role" : role}
        });
    }

    function getUsers() {
        return $http({
                url: "/getUsers", 
                method: "GET"
            });
    }

    function getRoles() {
        return $http({
                url: "/getRoles", 
                method: "GET"
            });
    }

    function setAllowedRoles(user, roles) {
        return $http({
            url: "/setAllowedRoles", 
            method: "POST",
            data: {"email" : user.google.email, "roles" : roles}
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
        setAllowedRoles : setAllowedRoles
	}
}]);
