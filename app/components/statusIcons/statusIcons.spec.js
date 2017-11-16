describe('Testing statusIcons component', function () {
    var $controller, dashboardService, scope;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($componentController, $rootScope, $interval){
            dashboardService = jasmine.createSpyObj('dashboardService', ['icons']);
            scope = $rootScope.$new();

            $controller = $componentController('statusIcons', {
                $scope: scope, 
                dashboardService: dashboardService
            });
        });

    });

    it('should define the statusIcons component', function() {
        expect($controller).toBeDefined();
    });

    it('should define statusIcons', function(){
        dashboardService.icons.and.callFake(function() {
            return {sIcon:"green", gIcon:"green", pIcon:"green",dIcon:"green"};
        });
        expect(scope.statusIcons).toBeDefined();
        expect(scope.statusIcons).toEqual(dashboardService.icons);
    });

    it('should define default color for all the icons', function(){
        expect($controller.satstatusIconColor).toEqual("#12C700");
        expect($controller.gsstatusIconColor).toEqual("#12C700");
        expect($controller.proxystatusIconColor).toEqual("#12C700");
        expect($controller.dbstatusIconColor).toEqual("#12C700");       
    });

    it('should update color of icons when database is not connected', function(){
        scope.statusIcons = { sIcon:"grey", gIcon:"grey", pIcon:"grey", dIcon:"red" };

        scope.$digest();
        expect($controller.satstatusIconColor).toEqual("#CFCFD5");
        expect($controller.gsstatusIconColor).toEqual("#CFCFD5");
        expect($controller.proxystatusIconColor).toEqual("#CFCFD5");
        expect($controller.dbstatusIconColor).toEqual("#FF0000"); 
    });

    it('should update color of icons when data is stale', function(){
        scope.statusIcons = { sIcon:"grey", gIcon:"red", pIcon:"green", dIcon:"blue" };

        scope.$digest();
        expect($controller.satstatusIconColor).toEqual("#CFCFD5");
        expect($controller.gsstatusIconColor).toEqual("#FF0000");
        expect($controller.proxystatusIconColor).toEqual("#12C700");
        expect($controller.dbstatusIconColor).toEqual("#71A5BC"); 
    });

    it('should update color of icons when there is no streamed data', function(){
        scope.statusIcons = { sIcon:"red", gIcon:"green", pIcon:"green", dIcon:"green" };

        scope.$digest();
        expect($controller.satstatusIconColor).toEqual("#FF0000");
        expect($controller.gsstatusIconColor).toEqual("#12C700");
        expect($controller.proxystatusIconColor).toEqual("#12C700");
        expect($controller.dbstatusIconColor).toEqual("#12C700"); 
    });

    it('should update color of icons when proxy application is not running', function(){
        scope.statusIcons = { sIcon:"grey", gIcon:"grey", pIcon:"red", dIcon:"green" };

        scope.$digest();
        expect($controller.satstatusIconColor).toEqual("#CFCFD5");
        expect($controller.gsstatusIconColor).toEqual("#CFCFD5");
        expect($controller.proxystatusIconColor).toEqual("#FF0000");
        expect($controller.dbstatusIconColor).toEqual("#12C700"); 
    });

    it('should update color of icons when everything works', function(){
        scope.statusIcons = { sIcon:"green", gIcon:"green", pIcon:"green", dIcon:"green" };

        scope.$digest();
        expect($controller.satstatusIconColor).toEqual("#12C700");
        expect($controller.gsstatusIconColor).toEqual("#12C700");
        expect($controller.proxystatusIconColor).toEqual("#12C700");
        expect($controller.dbstatusIconColor).toEqual("#12C700"); 
    });

});
