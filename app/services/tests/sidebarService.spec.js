describe('Testing sidebarService', function () {
    var sidebarService, dashboardService;

    beforeEach(function () {
        // load the module
        module('app');

        dashboardService = jasmine.createSpyObj('dashboardService', ['getData']);

        module(function($provide) {
            $provide.value('dashboardService', dashboardService);
        });

        var result = {
            'value' : 0.71,
            'alarm_low' : '-1.1',
            'alarm_high' : '1.1',
            'warn_low' : '-1',
            'warn_high' : '1'
        };

        dashboardService.getData.and.callFake(function() {
            return result;
        });

        
        // get your service
        inject(function (_sidebarService_) {
            sidebarService = _sidebarService_;
        });
    });

    //sidebarService should exist in the application
    it('sidebarService should exist', function() {
    	expect(sidebarService).toBeDefined();
    });

    /*it('should define data object', function() {
        var data = {
            parameters : []
        }
        expect(sidebarService.data).toBeDefined();
        expect(sidebarService.data).toEqual(data);
    });*/

    it('should define the function setTempWidget', function () {
        expect(sidebarService.setTempWidget).toBeDefined();
    });

    it('should define the function setVehicleInfo', function () {
        expect(sidebarService.setVehicleInfo).toBeDefined();
    });

    it('should be able to set the vehicle info in the widget when setVehicleInfo is called', function () {
        var datastring = 'A0.GNC.attitude.q1';

        var vehicleInfo = {
            vehicle:'A0',
            id:'q1',
            key:'A0.GNC.attitude.q1',
            category:'attitude'
        };

        var widget = {
            settings: {
                dataArray: []
            }
        };

        var widgetObject = {
            getValue: function(value) {
              
            }
        };

        spyOn(widgetObject, 'getValue');

        sidebarService.setTempWidget(widget, widgetObject);
        sidebarService.setVehicleInfo(datastring);

        expect(widgetObject.getValue).toHaveBeenCalledWith(false);
        expect(widget.settings.dataArray[0]).toEqual(vehicleInfo);
    });

    /*it('should be able to set the default vehicle info when setVehicleInfo is called with empty string', function () {
        sidebarService.setVehicleInfo("");
        var vehicleInfo = {
            vehicle:'',
            id:'',
            key:'',
            category:''
        }
        expect(sidebarService.data.parameters.length).toEqual(0);

    });*/

    /*it('should define the function getVehicleInfo', function () {
        expect(sidebarService.getVehicleInfo).toBeDefined();
    });*/

    /*it('should be able to retrieve vehicleInfo when getVehicleInfo is called', function () {
        var datastring = 'A0.GNC.attitude.q1';
        
        sidebarService.setVehicleInfo(datastring);

        var vehicleInfo = { 
            vehicle: 'A0', 
            id: 'q1', 
            key: 'A0.GNC.attitude.q1',
            category: 'attitude' 
        }

        expect(sidebarService.getVehicleInfo().parameters).toEqual([vehicleInfo]);
    });*/

    it('should define the function setMenuStatus', function () {
        expect(sidebarService.setMenuStatus).toBeDefined();
    });

    it('should define the function getMenuStatus', function () {
        expect(sidebarService.getMenuStatus).toBeDefined();
    });

    it('should set the menuStatus variable to true', function(){
        sidebarService.setMenuStatus(true);

        var result = sidebarService.getMenuStatus();

        expect(result).toEqual(true);
    });

    it('should define the function setOpenLogo', function () {
        expect(sidebarService.setOpenLogo).toBeDefined();
    });

    it('should define the function getOpenLogo', function () {
        expect(sidebarService.getOpenLogo).toBeDefined();
    });

    it('should set the openLogo variable to true', function(){
        sidebarService.setOpenLogo(true);

        var result = sidebarService.getOpenLogo();

        expect(result).toEqual(true);
    });
 
});