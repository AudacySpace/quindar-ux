describe('Testing Satellite controller', function () {
    var controller, scope;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope){
            scope = $rootScope.$new();
            scope.widget = {
                name: "3D Model",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false
                }
            };

            controller = $controller('SatCtrl', {
                $scope: scope,
            });
        });

    });

    it('should define Satellite controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define model url location', function(){
        expect(scope.modelUrl).toBeDefined();
        expect(scope.modelUrl).toEqual('./directives/satellite/models/a0_complex.json');
    });

    it('should define step variable', function(){
        expect(scope.step).toBeDefined();
        expect(scope.step).toEqual(0.01);
    });

    it('should define min variable', function(){
        expect(scope.min).toBeDefined();
        expect(scope.min).toEqual(0.2);
    });

    it('should define max variable', function(){
        expect(scope.max).toBeDefined();
        expect(scope.max).toEqual(1.8);
    });

    it('should define quaternion as an empty object', function(){
        expect(scope.quaternion).toBeDefined();
        expect(scope.quaternion).toEqual({});
    });

    it('should define colors as an empty object', function(){
        expect(scope.colors).toBeDefined();
        expect(scope.colors).toEqual({});
    });

    it('should define zoom property for settings', function(){
        expect(scope.widget.settings.zoom).toBeDefined();
        expect(scope.widget.settings.zoom).toEqual(1.0);
    });
});
