describe('Testing saveMenu component', function () {
    var $controller;

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($componentController){
            $controller = $componentController('saveMenu');
        });
    });

    it('component controller should be defined', function() {
    	expect($controller).toBeDefined();
    });

    it('function closeSaveLoadSettings should be defined', function() {
    	expect($controller.closeSaveLoadSettings).toBeDefined();
    });

    it('closeSaveLoadSettings function should close the save and load menu', function() {
        var widget = {
            sizeY: 3,
            sizeX: 4,
            name: "Line Plot",
            directive: "graph",
            directiveSettings: "linesettings",
            id: "addLine",
            icon: {
                id: "l-plot",
                type: "fa-line-chart"
            },
            main: false,
            settings: {
                active: false,
                data : {
                    vehicles : [],
                    value : "", 
                    key: ""
                }
            },
            saveLoad: true,
            delete: false
        }

        $controller.closeSaveLoadSettings(widget);
        expect(widget.saveLoad).toEqual(false);
        expect(widget.main).toEqual(true);
    });
});
