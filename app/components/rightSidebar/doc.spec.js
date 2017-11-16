describe('Testing document controller', function () {
    var controller, scope, close;

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            close = jasmine.createSpy();
            controller = $controller('docController', {
                $scope: scope,
                close: close
            });
        });
    });

    it('should define document controller', function() {
    	expect(controller).toBeDefined();
    });

    it('should define the function close', function() {
    	expect(scope.close).toBeDefined();
    });

    it('should call the function close on closing the documentation', function() {
        scope.close();

        expect(close).toHaveBeenCalled();
    });
});
