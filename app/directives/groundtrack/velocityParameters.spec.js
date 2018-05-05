describe('Testing velocityParameters controller', function () {
    var controller, scope;
    var modalInstance = { dismiss: function() {} };
    var velocityItems = { pdata : [], vdata : []};
    var vehicleId = 0;

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            controller = $controller('velocityParametersCtrl', {
                $uibModalInstance: modalInstance,
                $scope: scope,
                velocityItems: velocityItems,
                vehicleId: vehicleId
            });
            
        });
    });

    it('should define attitude list controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define the data in controller scope', function() {
        expect(controller.data).toBeDefined();
        expect(controller.data).toEqual(velocityItems);
    });

    it('should define the function close', function() {
        expect(controller.close).toBeDefined();
    });

    it('should call the modalInstance dismiss on close function call', function() {
        spyOn(modalInstance, 'dismiss');

        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should define the function save', function() {
        expect(controller.save).toBeDefined();
    });

});
