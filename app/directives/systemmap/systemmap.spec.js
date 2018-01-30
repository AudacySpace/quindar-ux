describe('Testing System Map controller', function () {
    var controller, dashboardService, scope, datastatesService, $intervalSpy;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, $interval){
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            dashboardService = jasmine.createSpyObj('dashboardService', ['icons']);
            datastatesService = jasmine.createSpyObj('datastatesService', ['colorValues', 'getDataColor']);

            scope = $rootScope.$new();
            scope.widget = {
                name: "System Map",
                settings: {
                    active: false
                }
            };

            controller = $controller('SystemMapCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                datastatesService: datastatesService,
                $interval: $intervalSpy
            });
        });

    });

    it('should define system map controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define dataStatus', function(){
        dashboardService.icons.and.callFake(function() {
            return {sIcon:"green", gIcon:"green", pIcon:"green",dIcon:"green"};
        });
        expect(scope.dataStatus).toBeDefined();
        expect(scope.dataStatus).toEqual(dashboardService.icons);
    });

    it('should define image location in settings', function(){
        expect(scope.widget.settings.imglocation).toBeDefined();
        expect(scope.widget.settings.imglocation).toEqual('/media/systemmaps/sysmap.jpg');
    });
});
