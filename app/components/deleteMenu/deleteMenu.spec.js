describe('Testing deleteMenu component', function () {
    var $controller, gridService;

    beforeEach(function () {
        // load the module
        module('app');

        inject( function($componentController){
            gridService = jasmine.createSpyObj('gridService', ['remove']);
            $controller = $componentController('deleteMenu', {gridService: gridService});
        });
    });

    it('should define deleteMenu component controller', function() {
    	expect($controller).toBeDefined();
    });

    it('should define the function deleteWidget', function() {
    	expect($controller.deleteWidget).toBeDefined();
    });

    it('should define the function closedeleteWidget', function() {
        expect($controller.closedeleteWidget).toBeDefined();
    });

    it('should remove the widget when deleteWidget is called', function() {
        var widget = {
            name: "3D Model",
            directive: "satellite",
            directiveSettings: "satellitesettings",
            main: true,
            settings: {
                active: false
            },
            saveLoad: false,
            delete: false
        }

        $controller.deleteWidget(widget);

        expect(gridService.remove).toHaveBeenCalled();
        expect(gridService.remove).toHaveBeenCalledWith(widget);
    });

    it('should switch to main menu when closedeleteWidget function is called', function() {
        var widget = {
            main: false,
            settings: {
                active: false
            },
            saveLoad: false,
            delete: true
        }

        $controller.closedeleteWidget(widget);

        expect(widget.main).toEqual(true);
        expect(widget.settings.active).toEqual(false);
        expect(widget.saveLoad).toEqual(false);
        expect(widget.delete).toEqual(false);
    });
});
