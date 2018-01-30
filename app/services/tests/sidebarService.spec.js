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

    it('should define the default value for vehicleInfo', function() {
        var vehicleInfo = vehicleInfo = {
            vehicle : '',
            id : '',
            key : ''
        }
        expect(sidebarService.vehicleInfo).toBeDefined();
        expect(sidebarService.vehicleInfo).toEqual(vehicleInfo);
    });

    it('should define the function setVehicleInfo', function () {
        expect(sidebarService.setVehicleInfo).toBeDefined();
    });

    it('should be able to set the vehicle info when setVehicleInfo is called', function () {
        var datastring = 'A0.GNC.attitude.q1';
        
        sidebarService.setVehicleInfo(datastring);

        expect(sidebarService.vehicleInfo.vehicle).toEqual('A0');
        expect(sidebarService.vehicleInfo.id).toEqual('q1');
        expect(sidebarService.vehicleInfo.key).toEqual('A0.GNC.attitude.q1');
    });

    it('should be able to set the default vehicle info when setVehicleInfo is called with empty string', function () {
        sidebarService.setVehicleInfo("");

        expect(sidebarService.vehicleInfo.vehicle).toEqual('');
        expect(sidebarService.vehicleInfo.id).toEqual('');
        expect(sidebarService.vehicleInfo.key).toEqual('');
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
            key: 'A0.GNC.attitude.q1' 
        }

        expect(sidebarService.getVehicleInfo()).toEqual(vehicleInfo);
    });
 
});