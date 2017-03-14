app.controller('docController', ['$scope', 'close', function($scope, close) {

  $scope.close = function(result) {
 	  close(result); // close
  };

}]);