describe('Testing clock settings controller', function () {
    var controller, scope;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope){
            scope = $rootScope.$new();
            scope.widget = {
                name: "Clock",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    clocks: []
                }
            };

            controller = $controller('ClockSettingsCtrl', {
                $scope: scope, 
            });
        });

    });

    it('clock settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should define scope.selected', function() {
        expect(scope.selected).toBeDefined();
        expect(scope.selected).toEqual({});
    });

    it('should define scope.types', function() {
        var types = [{
            'key': 1,
            'value': 'Clock'
        }, 
        {
            'key': 2,
            'value': 'Timer'
        }]
        expect(scope.types).toBeDefined();
        expect(scope.types).toEqual(types);
    });

    it('should define scope.timezones', function() {
        var timezones = [{
            'key': 1,
            'value': 'UTC',
            'zone': 0
        }, 
        {
            'key': 2,
            'value': 'San Francisco',
            'zone': -8
        }, 
        {
            'key': 3,
            'value': 'Singapore',
            'zone': 8
        }, 
        {
            'key': 4,
            'value': 'Luxembourg',
            'zone': 2
        }];

        expect(scope.timezones).toBeDefined();
        expect(scope.timezones).toEqual(timezones);
    });

    it('should define function closeSettings', function() {
        expect(scope.closeSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.closeSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should not close the settings menu on save when the type is not selected', function() {
        scope.selected.type = {};
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(false);
        expect(scope.widget.settings.active).toEqual(true);
    });

    it('should push data to widget settings and close the settings menu on save when type Clock', function() {
        var result = [{
            name: 'UTC',
            timezone : 0
        }];

        scope.selected.type = { value : 'Clock'};
        scope.selected.timezone = {
            value : 'UTC',
            zone : 0
        }
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.settings.clocks).toEqual(result);
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.selected).toEqual({});
    });

    it('should not close the settings menu on save when type Timer and name and reference time are empty', function() {
        scope.name = "";
        scope.reference = "";
        scope.selected.type = { value : 'Timer'};
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(false);
        expect(scope.widget.settings.active).toEqual(true);
    });

    it('should push data to widget settings and close the settings menu on save when type Timer', function() {
        var result = [{
            name: 'AAA',
            reference : '2018-07-12T17:00:00.000Z'
        }];

        scope.selected.type = { value : 'Timer'};
        scope.name = "AAA";
        scope.reference = "2018-07-12T17:00:00.000Z";
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.settings.clocks).toEqual(result);
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.selected).toEqual({});
        expect(scope.name).toEqual("");
        expect(scope.reference).toEqual("");
    });
})