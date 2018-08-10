describe('Testing data table settings controller', function () {
    var controller, scope, dashboardService;
    var element = angular.element('<div></div>'); //provide element you want to test

    var windowMock = {
        user : {
            role : {}
        },
        document:{},
        innerWidth: 1440
    }
    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
        });

        inject(function($controller, $rootScope, _$q_, _dashboardService_){
            dashboardService = _dashboardService_;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['displayWidgetAlert']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "Data Table",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    checkedValues:{
                        checkedId: true,
                        checkedName: true,
                        checkedAlow: true,
                        checkedWlow: true,
                        checkedValue: true,
                        checkedWhigh: true,
                        checkedAhigh: true,
                        checkedUnits: true,
                        checkedNotes: true
                    },
                    data : []
                }
            };

            controller = $controller('DatatableSettingsCtrl', {
                $scope: scope,
                $element: element,
                dashboardService: dashboardService,
            });
        });

    });

    it('command settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should assign default value to checkedValues variable', function() {
        expect(scope.checkedValues).toBeDefined
        expect(scope.checkedValues).toEqual(scope.widget.settings.checkedValues);
    });

    it('should define function closeDataTableSettings', function() {
        expect(scope.closeDataTableSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.closeDataTableSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should define function saveDataTableSettings', function() {
        expect(scope.saveDataTableSettings).toBeDefined();
    });

    it('should not close the settings menu on save if data is not selected', function() {
        //all category values are false
        scope.checkedValues = {
            checkedId: false,
            checkedName: false,
            checkedAlow: false,
            checkedWlow: false,
            checkedValue: false,
            checkedWhigh: false,
            checkedAhigh: false,
            checkedUnits: false,
            checkedNotes: false
        };
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveDataTableSettings(scope.widget);
        
        expect(scope.widget.main).not.toEqual(true);
        expect(scope.widget.settings.active).not.toEqual(false);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please check at least one category!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should close the settings menu on save if data is selected', function() {
        //all category values are not false
        scope.checkedValues = {
            checkedId: false,
            checkedName: true,
            checkedAlow: false,
            checkedWlow: false,
            checkedValue: true,
            checkedWhigh: false,
            checkedAhigh: false,
            checkedUnits: true,
            checkedNotes: false
        };
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveDataTableSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });
})