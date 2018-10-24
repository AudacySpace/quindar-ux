describe('Testing clock controller', function () {
    var controller, dashboardService, scope, datastatesService, $intervalSpy;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, $interval){
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['icons', 'getTime', 'countdown']);
            datastatesService = jasmine.createSpyObj('datastatesService', ['colorValues']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "Clock",
                settings: {
                    active: false,
                    clocks: [{
                        name : 'UTC',
                        timezone : 'UTC',
                    },{
                        name : 'AAA',
                        reference : "2018-07-12T17:00:00.000Z",
                    }]
                }
            };

            controller = $controller('ClockCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                datastatesService: datastatesService,
                $interval: $intervalSpy
            });
        });

    });

    it('clock controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should define statusIcons', function(){
        dashboardService.icons.and.callFake(function() {
            return {sIcon:"green", gIcon:"green", pIcon:"green",dIcon:"green"};
        });
        expect(scope.statusIcons).toBeDefined();
        expect(scope.statusIcons).toEqual(dashboardService.icons);
    })

    it('checkForClockData() function should be defined and called once', function(){
        expect(scope.checkForClockData).toBeDefined();
        expect(scope.clocks.length).toEqual(2);
    })

    it('should update the scope.clock time when clock type', function(){
        scope.widget.settings.clocks =[{
                        name : 'UTC',
                        timezone : 'UTC',
                    }];

        dashboardService.getTime.and.callFake(function() {
            return {
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '50'
            };
        });

        scope.updateClock();
        expect(scope.clocks[0].name).toEqual('UTC');
        expect(scope.clocks[0].time.days).toEqual('070');
        expect(scope.clocks[0].time.minutes).toEqual('10');
        expect(scope.clocks[0].time.hours).toEqual('10');
        expect(scope.clocks[0].time.seconds).toEqual('50');
    })

    it('should update the scope.clock time and sign when timer type', function(){
        scope.widget.settings.clocks =[{
                        name : 'AAAA',
                        reference : '2018-07-12T17:00:00.000Z',
                    }];

        dashboardService.countdown.and.callFake(function() {
            return {
                days : '080',
                minutes : '20',
                hours : '8',
                seconds : '12',
                sign : '-'
            };
        });

        scope.updateClock();
        expect(scope.clocks[0].name).toEqual('AAAA');
        expect(scope.clocks[0].time.days).toEqual('080');
        expect(scope.clocks[0].time.sign).toEqual('-');
        expect(scope.clocks[0].time.minutes).toEqual('20');
        expect(scope.clocks[0].time.hours).toEqual('8');
        expect(scope.clocks[0].time.seconds).toEqual('12');
    })

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    })

    it('should call $interval on updateClock function', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.updateClock, 500);
    })

    it('remove() function should remove the clock at index', function(){
        var clocks = [{
                        name : 'AAA',
                        reference : "2018-07-12T17:00:00.000Z",
                    }];

        expect(scope.remove).toBeDefined();

        scope.remove(0);
        expect(scope.widget.settings.clocks.length).toEqual(1);
        expect(scope.widget.settings.clocks).toEqual(clocks);
    })

    it('should cancel interval when scope is destroyed', function(){
        spyOn($intervalSpy, 'cancel');
        scope.$destroy();
        expect($intervalSpy.cancel.calls.count()).toBe(1);
    })

});
