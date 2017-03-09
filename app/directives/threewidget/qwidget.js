app
    .directive('qwidget', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl:'./directives/threewidget/threewidget.html',
            controller: 'threeController',
            link: function(scope, element, attrs) {
            }
        };
    });