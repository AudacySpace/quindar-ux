describe('Testing system map settings controller', function () {
    var controller, scope, gridService, deferredMaps;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, _$q_){
            deferredMaps = _$q_.defer();
            gridService = jasmine.createSpyObj('gridService', ['loadMaps']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "systemmap",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                }
            };

            gridService.loadMaps.and.callFake(function() {
                return deferredMaps.promise;
            });

            controller = $controller('SystemSettingsCtrl', {
                $scope: scope, 
                gridService: gridService
            });
        });

    });

    it('command settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should load maps data and assign to images variable', function() {
        var result = [{
            "imagefile": "systemmap.jpg",
            "contentsfile": "imagedata.json",
            "imageid": "PowerSystem",
            "contents": [],
            "image": ""
        }];

        deferredMaps.resolve({data : result, status: 200});
        scope.$digest();

        expect(scope.images).toEqual(result);
    });

    it('should not load maps data and assign to images variable(status other than 200)', function() {
        var result = [{
            "imagefile": "systemmap.jpg",
            "contentsfile": "imagedata.json",
            "imageid": "PowerSystem",
            "contents": [],
            "image": ""
        }];

        deferredMaps.resolve({data : result, status: 404});
        scope.$digest();

        expect(scope.images).not.toEqual(result);
    });

    it('should assign the select variable an imageid if available)', function() {
        expect(scope.selected).toEqual({});
    });

    it('should define function closeSettings', function() {
        expect(scope.closeSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.settings.imageid = "PowerSystem";
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.closeSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);

        //scope.selected.imageid should equal scope.widget.settings.imageid on close
        expect(scope.selected).toEqual({"imageid": "PowerSystem"});
    });

    it('should define function saveSettings', function() {
        expect(scope.saveSettings).toBeDefined();
    });

    it('should not close the settings menu on save if the image is not selected from dropdown', function() {
        scope.selected.image = undefined;
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).not.toEqual(true);
        expect(scope.widget.settings.active).not.toEqual(false);
    });

    it('should close the settings menu on save if the image is selected from dropdown', function() {
        scope.images = [];
        scope.selected.imageid = "PowerSystem";
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should save the selected image in the widget settings', function() {
        var settings = { 
            active: false, 
            imageid: 'PowerSystem', 
            imglocation: 'data:image/gif;base64,', 
            contents: []
        }

        scope.images = [{
            "imagefile": "systemmap.jpg",
            "contentsfile": "imagedata.json",
            "imageid": "PowerSystem",
            "contents": [],
            "image": ""
        }];
        scope.selected.imageid = "PowerSystem";
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);

        expect(scope.widget.settings).toEqual(settings);
    });

})