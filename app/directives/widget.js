// directive: quindarwidget
app
.directive('quindarwidget', ['$compile', function (compile) {
  return {
    restrict: 'AE',
    scope: {
        quindarwidget: '@'
    },
    replace: true,
    controller: ['$scope', function (scope) {
        scope.$watch('quindarwidget', function (value) {
            scope.buildView(value);
        });
    }],
    link: function (scope, elm, attrs) {
        scope.buildView = function (viewName) {
            var z = compile('<' + viewName + '></' + viewName + '>')(scope);
            elm.append(z);
        }
    }
  }
}])