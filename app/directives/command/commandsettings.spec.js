describe('Testing command settings controller', function () {
    var controller, scope;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope){
            scope = $rootScope.$new();
            scope.widget = {
                name: "Command",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    commandlog: true
                }
            };

            controller = $controller('CommandSettingsCtrl', {
                $scope: scope, 
            });
        });

    });

    it('command settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should define scope.commandlog', function() {
        expect(scope.commandlog).toBeDefined();
        expect(scope.commandlog).toEqual(scope.widget.settings.commandlog);
    });

    it('should define function closeSettings', function() {
        expect(scope.closeSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.settings.commandlog = false;
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.closeSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);

        //scope.commandlog should equal scope.widget.settings.commandlog on close
        expect(scope.commandlog).toEqual(false);
    });

    it('should define function saveSettings', function() {
        expect(scope.saveSettings).toBeDefined();
    });

    it('should push data to widget settings and close the settings menu on save', function() {
        scope.commandlog = true;
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.commandlog).toEqual(true);
    });
})