describe('Testing attitudeList controller', function () {
    var controller, scope;
    var modalInstance = { dismiss: function() {} };
    var attitudeItems = { attitudeData : [], positionData : []};

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            controller = $controller('attitudeListCtrl', {
                $uibModalInstance: modalInstance,
                $scope: scope,
                attitudeItems: attitudeItems
            });
            
        });
    });

    it('should define attitude list controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define the data in controller scope', function() {
        expect(controller.data).toBeDefined();
        expect(controller.data).toEqual(attitudeItems);
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
