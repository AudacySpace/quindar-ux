describe('Testing sidebarService', function () {
    var sidebarService;

    beforeEach(function () {
        // load the module
        module('app');

        // get your service
        inject(function (_sidebarService_) {
            sidebarService = _sidebarService_;
        });
    });

    //sidebarService should exist in the application
    it('sidebarService should exist', function() {
    	expect(sidebarService).toBeDefined();
    });

    it('should define data object', function() {
        var data = {
            parameters : []
        }
        expect(sidebarService.data).toBeDefined();
        expect(sidebarService.data).toEqual(data);
    });

    it('should define the function setVehicleInfo', function () {
        expect(sidebarService.setVehicleInfo).toBeDefined();
    });

    it('should be able to set the vehicle info when setVehicleInfo is called', function () {
        var datastring = 'A0.GNC.attitude.q1';
        var vehicleInfo = {
            vehicle:'A0',
            id:'q1',
            key:'A0.GNC.attitude.q1',
            category:'attitude'
        }
        
        sidebarService.setVehicleInfo(datastring);

        expect(sidebarService.data.parameters.length).toEqual(1);
        expect(sidebarService.data.parameters[0]).toEqual(vehicleInfo);
    });

    it('should be able to set the default vehicle info when setVehicleInfo is called with empty string', function () {
        sidebarService.setVehicleInfo("");
        var vehicleInfo = {
            vehicle:'',
            id:'',
            key:'',
            category:''
        }
        expect(sidebarService.data.parameters.length).toEqual(0);

    });

    it('should define the function getVehicleInfo', function () {
        expect(sidebarService.getVehicleInfo).toBeDefined();
    });

    it('should be able to retrieve vehicleInfo when getVehicleInfo is called', function () {
        var datastring = 'A0.GNC.attitude.q1';
        
        sidebarService.setVehicleInfo(datastring);

        var vehicleInfo = { 
            vehicle: 'A0', 
            id: 'q1', 
            key: 'A0.GNC.attitude.q1',
            category: 'attitude' 
        }

        expect(sidebarService.getVehicleInfo().parameters).toEqual([vehicleInfo]);
    });
 
});