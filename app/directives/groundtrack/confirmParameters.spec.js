describe('Testing confirm controller', function () {
    var controller, scope;
    var modalInstance = { dismiss: function() {} ,close: function(){}};
    var dataLabel = "Is the velocity coordinates selected order is:vx,vy,vz?";
    var dataItems = { pdata : [], vdata : []};

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            controller = $controller('confirmParametersCtrl', {
                $uibModalInstance: modalInstance,
                $scope: scope,
                dataItems: dataItems,
                dataLabel: dataLabel
            });
            
        });
    });

    it('should define confirm controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define the data in controller scope', function() {
        expect(controller.modalLabel).toBeDefined();
        expect(controller.modalLabel).toEqual("Is the velocity coordinates selected order is:vx,vy,vz?");
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

    it('should call the modalInstance close with dataItems on save function call', function() {
        spyOn(modalInstance, 'close');

        controller.save();
        expect(modalInstance.close).toHaveBeenCalledWith(dataItems);
    });

});
