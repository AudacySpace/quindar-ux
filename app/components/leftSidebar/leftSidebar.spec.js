describe('Testing leftSidebar component', function () {
    var $controller, dashboardService, sidebarService, $interval;
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

        inject( function($componentController, _$interval_, _$q_){
            dashboardService = jasmine.createSpyObj('dashboardService', ['getTelemetryValues', 'getLock','displayAlert']);
            sidebarService = jasmine.createSpyObj('sidebarService', ['setVehicleInfo', 'getMenuStatus', 'setMenuStatus', 'getOpenLogo']);
            $interval = _$interval_;

            $controller = $componentController('leftSidebar', {
                sidebarService: sidebarService,
                dashboardService: dashboardService,
                $interval: $interval
            });
            
        });
    });

    it('should define leftSidebar component controller', function() {
    	expect($controller).toBeDefined();
    });

    it('should define searchID to be empty', function() {
        expect($controller.searchID).toBeDefined();
        expect($controller.searchID).toEqual("");
    });

    it('should define previousTree to be an empty array', function() {
        expect($controller.previousTree).toBeDefined();
        expect($controller.previousTree).toEqual([]);
    });

    it('should define the function selectData', function() {
    	expect($controller.selectData).toBeDefined();
    });

    it('should define the function filter', function() {
        expect($controller.filter).toBeDefined();
    });

    it('should make the data tree from the telemetry', function(){
        var result = {
            'A0' : {
                'GNC' : {
                    'Attitude': {
                        'q1' : {
                            'value' : 0.71,
                            'alarm_low' : '-1.1',
                            'alarm_high' : '1.1',
                            'warn_low' : '-1',
                            'warn_high' : '1'
                        }
                    }
                }
            }
        };

        var dataTree = [{
            "name":"A0",
            "nodes":[{
                "name":"GNC",
                "nodes":[{
                    "name":"Attitude",
                    "nodes":[{
                        "name":"q1",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q1",
                        "active":false
                    }],
                    "value":"A0.GNC.Attitude",
                    "active":false
                }],
                "value":"A0.GNC",
                "active":false
            }],
            "value":"A0",
            "active":false
        }];

        dashboardService.getTelemetryValues.and.callFake(function() {
            return {"time": "2018-02-16T00:26:41.439Z", "data": result };
        });

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        sidebarService.getMenuStatus.and.callFake(function(){
            return true;
        });

        $interval.flush(1001);
        expect($controller.dataTree).toEqual(dataTree);
        expect($controller.previousTree).toEqual(dataTree);
    });

    it('should make the data tree empty if there is no telemetry', function(){
        dashboardService.getTelemetryValues.and.callFake(function() {
            return {};
        });

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        sidebarService.getMenuStatus.and.callFake(function(){
            return true;
        });

        $interval.flush(1001);
        expect($controller.dataTree).toEqual([]);
        expect($controller.previousTree).toEqual([]);
    });

    it('should make toggle the active property if child nodes present, on selectData function call', function(){
        var data = {
            "name":"GNC",
            "nodes":[{
                "name":"Attitude",
                "nodes":[{
                    "name":"q1",
                    "nodes":[],
                    "value":"A0.GNC.Attitude.q1",
                    "active":false
                }],
                "value":"A0.GNC.Attitude",
                "active":false
            }],
            "value":"A0.GNC",
            "active":false
        };

        sidebarService.getOpenLogo.and.callFake(function(){
            return true;
        });

        $controller.selectData(data);

        expect(data.active).toEqual(true);
        //do not call setVehicleInfo if the data menu is opened through the logo
        expect(sidebarService.setVehicleInfo).not.toHaveBeenCalled();
    });

    it('should set vehicleInfo in sidebarService if no children of child nodes(parent of leaf node)', function(){
        var data = {
            "name":"Attitude",
            "nodes":[{
                "name":"q1",
                "nodes":[],
                "value":"A0.GNC.Attitude.q1",
                "active":false
            }],
            "value":"A0.GNC.Attitude",
            "active":false
        };

        sidebarService.getOpenLogo.and.callFake(function(){
            return false;
        });

        $controller.selectData(data);

        expect(data.active).toEqual(true);
        //data menu opened through a qwidget
        expect(sidebarService.setVehicleInfo).toHaveBeenCalled();
        expect(sidebarService.setVehicleInfo).toHaveBeenCalledWith('A0.GNC.Attitude');
    });

    it('should make a call to sidebarService setVehicleInfo if no child nodes, on selectData function call', function(){
        var data = {
            "name":"q1",
            "nodes":[],
            "value":"A0.GNC.Attitude.q1",
            "active":false
        };

        sidebarService.getOpenLogo.and.callFake(function(){
            return false;
        });

        $controller.selectData(data);

        //data menu opened through a qwidget
        expect(sidebarService.setVehicleInfo).toHaveBeenCalled();
        expect(sidebarService.setVehicleInfo).toHaveBeenCalledWith('A0.GNC.Attitude.q1');
    });

    it('should filter the tree, on filter function call(searchID found)', function(){
        $controller.previousTree = [{
            "name":"A0",
            "nodes":[{
                "name":"GNC",
                "nodes":[{
                    "name":"Attitude",
                    "nodes":[
                    {
                        "name":"q1",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q1",
                        "active":false
                    },{
                        "name":"q2",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q2",
                        "active":false
                    }],
                    "value":"A0.GNC.Attitude",
                    "active":false
                }],
                "value":"A0.GNC",
                "active":false
            }],
            "value":"A0",
            "active":false
        }];
        $controller.searchID = "q1";

        var filteredTree = [{
            "name":"A0",
            "nodes":[{
                "name":"GNC",
                "nodes":[{
                    "name":"Attitude",
                    "nodes":[
                    {
                        "name":"q1",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q1",
                        "active":false
                    }],
                    "value":"A0.GNC.Attitude",
                    "active":true
                }],
                "value":"A0.GNC",
                "active":true
            }],
            "value":"A0",
            "active":true
        }];

        $controller.filter();

        expect($controller.dataTree).toEqual(filteredTree);
    });

    it('should alert the user, on filter function call(searchID not found)', function(){
        $controller.previousTree = [{
            "name":"A0",
            "nodes":[{
                "name":"GNC",
                "nodes":[{
                    "name":"Attitude",
                    "nodes":[
                    {
                        "name":"q1",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q1",
                        "active":false
                    },{
                        "name":"q2",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q2",
                        "active":false
                    }],
                    "value":"A0.GNC.Attitude",
                    "active":false
                }],
                "value":"A0.GNC",
                "active":false
            }],
            "value":"A0",
            "active":false
        }];
        $controller.searchID = "77";

        $controller.filter();

        expect($controller.dataTree).toEqual($controller.previousTree);
        expect(dashboardService.displayAlert).toHaveBeenCalledWith('No match found!','bottom left','',false);
    });

    it('should filter the tree, on filter function call(empty searchID)', function(){
        $controller.previousTree = [{
            "name":"A0",
            "nodes":[{
                "name":"GNC",
                "nodes":[{
                    "name":"Attitude",
                    "nodes":[
                    {
                        "name":"q1",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q1",
                        "active":false
                    },{
                        "name":"q2",
                        "nodes":[],
                        "value":"A0.GNC.Attitude.q2",
                        "active":false
                    }],
                    "value":"A0.GNC.Attitude",
                    "active":false
                }],
                "value":"A0.GNC",
                "active":false
            }],
            "value":"A0",
            "active":false
        }];
        $controller.searchID = "";

        $controller.filter();

        expect($controller.dataTree).toEqual($controller.previousTree);
    });
});
