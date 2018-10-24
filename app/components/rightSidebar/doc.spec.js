describe('Testing document controller', function () {
    var controller, scope;
    var modalInstance = { dismiss: function() {} };

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            close = jasmine.createSpy();
            controller = $controller('docController', {
                $scope: scope,
                $uibModalInstance: modalInstance,
            });
        });
    });

    it('should define document controller', function() {
    	expect(controller).toBeDefined();
    });

    it('should define the function close', function() {
    	expect(scope.close).toBeDefined();
    });

    it('should call the function dismiss on closing the documentation', function() {
        spyOn(modalInstance, 'dismiss');
        scope.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });
});
