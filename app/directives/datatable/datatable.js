app.directive('datatable', function() { 
  return { 
    restrict: 'E', 
    scope: {},
    templateUrl:'./directives/datatable/datatable.html', 
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
  	}; 
});

app.controller('DataTableCtrl', function ($scope) {
  var jsonData = '{"rows":{"data":[[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}],[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value": "","checked":"true","style":"text-align:right"},{"value": "","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value": "","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value": "","checked":"true","style":"text-align:left"}],[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}],[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}],[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}],[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}]]}}';
  $scope.table = JSON.parse(jsonData);

  $scope.addRowAbove = function($index){
    $scope.table.rows.data.splice($index,0,[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}]);
  }

  $scope.addRowBelow = function($index){
    $scope.table.rows.data.splice($index+1,0,[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:right"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}]);
  }

  $scope.deleteRow = function($index){
    $scope.table.rows.data.splice($index, 1);
  }

  $scope.moveRowUp = function($index){
    $scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
  }

  $scope.moveRowDown = function($index){
    $scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
  }

  $scope.convertHeader = function($index){
    $scope.table.rows.data[$index] = [{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colspan":"9","class":"header","placeholder":"Click here to edit"}];
  }

  $scope.convertToReadonly = function($index){
    $scope.table.rows.data[$index]["checked"] = "true";
  }
});


