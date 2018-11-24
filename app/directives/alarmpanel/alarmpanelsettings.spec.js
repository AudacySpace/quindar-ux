describe('Testing alarm panel settings controller', function () {
    var controller, scope;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope){
            scope = $rootScope.$new();
            scope.widget = {
                name: "Alarm Panel",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    statusboard: true
                }
            };

            controller = $controller('AlarmSettingsCtrl', {
                $scope: scope, 
            });
        });

    });

    it('should define alarm panel settings controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define scope.statusboard', function() {
        expect(scope.statusboard).toBeDefined();
        expect(scope.statusboard).toEqual(scope.widget.settings.statusboard);
    });

    it('should define function closeAlarmPanelSettings', function() {
        expect(scope.closeAlarmPanelSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.settings.statusboard = false;
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.closeAlarmPanelSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);

        //scope.statusboard should equal scope.widget.settings.statusboard on close
        expect(scope.statusboard).toEqual(false);
    });

    it('should define function saveAlarmPanelSettings', function() {
        expect(scope.saveAlarmPanelSettings).toBeDefined();
    });

    it('should push data to widget settings and close the settings menu on save', function() {
        scope.statusboard = true;
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveAlarmPanelSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.statusboard).toEqual(true);
    });
})