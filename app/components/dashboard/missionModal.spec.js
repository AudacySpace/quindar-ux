describe('Testing missionModal controller', function () {
    var controller, scope, dashboardService;
    var modalInstance = { close: function() {}, dismiss: function() {}, open: function() {} };
    var missions = [{ missionName : 'ATest', missionImage : '/media/icons/Audacy_Icon_White.svg'},
                    { missionName : 'AZero', missionImage : '/media/icons/Audacy_Zero.svg'}];

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($controller, $rootScope){
            scope = $rootScope.$new();
            dashboardService = jasmine.createSpyObj('dashboardService', ['setCurrentMission', 'isEmpty', 'missions']);

            dashboardService.missions.and.callFake(function() {
                return missions;
            });

            controller = $controller('missionModalCtrl', {
                $uibModalInstance: modalInstance,
                dashboardService: dashboardService,
                $scope: scope
            });   
        });
    });

    it('should define missionModal controller', function() {
    	expect(controller).toBeDefined();
    });

    it('should define the missions variable in controller scope', function() {
        expect(scope.missions).toBeDefined();
        expect(scope.missions).toEqual(dashboardService.missions);
    });

    it('should watch for missions and assign value to controller scope missions', function() {
        scope.missions = missions;

        scope.$digest();
        expect(controller.missions).toEqual(missions);
    });

    it('should define the current mission as empty', function() {
        expect(controller.currentMission).toBeDefined();
        expect(controller.currentMission).toEqual({});
    });

    it('should define the function setMission', function() {
        expect(controller.setMission).toBeDefined();
    });

    it('should set the mission for the dashboard when setMission is called', function() {
        controller.missionName = 'AZero';
        scope.missions = missions;

        spyOn(modalInstance, 'close');
        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });

        controller.setMission();
        expect(dashboardService.setCurrentMission).toHaveBeenCalledWith(controller.currentMission);
        expect(modalInstance.close).toHaveBeenCalled();
    });
});
