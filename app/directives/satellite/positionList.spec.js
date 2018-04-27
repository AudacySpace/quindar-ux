describe('Testing positionList controller', function () {
    var controller, scope;
    var modalInstance = { dismiss: function() {} };
    var positionItems = { attitudeData : [], positionData : []};

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            controller = $controller('positionListCtrl', {
                $uibModalInstance: modalInstance,
                $scope: scope,
                positionItems: positionItems
            });
            
        });
    });

    it('should define attitude list controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define the data in controller scope', function() {
        expect(controller.data).toBeDefined();
        expect(controller.data).toEqual(positionItems);
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
