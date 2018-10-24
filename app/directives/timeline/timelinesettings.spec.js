describe('Testing timeline settings controller', function () {
    var controller, scope, gridService;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope,_$q_){
            deferredTimelineEvents = _$q_.defer();
            gridService = jasmine.createSpyObj('gridService', 
                ['loadTimelineEvents']);
            scope = $rootScope.$new();
            scope.widget =     {
                sizeY: 3,
                sizeX: 4,
                name: "Timeline",
                directive: "timeLine",
                directiveSettings: "timelinesettings",
                id: "timeline",
                icon: {
                    id: "timeline",
                    type: "fa-tasks"
                },
                main: true,
                settings: {
                    active: false,
                    timezones: [],
                    grouporder: {
                        items1: []
                    },
                    events:[]
                },
                saveLoad: false,
                delete: false
            }

            gridService.loadTimelineEvents.and.callFake(function() {
                return deferredTimelineEvents.promise;
            });

            controller = $controller('timelineSettingsCtrl', {
                $scope: scope, 
                gridService: gridService,
            });
        });

    });

    it('timeline settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it("should not add timezone if it already exists in the timeline",function(){
        scope.selected = {
            type: {
                value: 'Timezone'
            }
        }

        scope.selected.timezone =  {
            name:"UTC",
            utcoffset : "+00:00",
            id:"utc",
            labeloffset : "+ 00"
        }

        var widget =     {
            sizeY: 3,
            sizeX: 4,
            name: "Timeline",
            directive: "timeLine",
            directiveSettings: "timelinesettings",
            id: "timeline",
            icon: {
                id: "timeline",
                type: "fa-tasks"
            },
            main: true,
            settings: {
                active: false,
                timezones: {},
                grouporder: {
                    items1: []
                },
                events:[]
            },
            saveLoad: false,
            delete: false
        }

        widget.settings.timezones = [{
            name:"UTC",
            utcoffset : "+00:00",
            id:"utc",
            labeloffset : "+ 00"
        }];

        scope.saveSettings(widget);

        expect(scope.timezoneErrMsg).toEqual("This time axis already exists in the qwidget");
        expect(scope.eventErrMsg).toEqual("");
        expect(scope.selected.timezone).toEqual({});
        expect(widget.settings.timezones.length).toEqual(1);
    });

    it("should add timezone if it is a new timezone in the timeline",function(){
        scope.selected = {
            type: {
                value: 'Timezone'
            }
        }

        scope.selected.timezone = {
            name:"San Francisco",
            utcoffset: "-08:00",
            id:"sfo",
            labeloffset : "- 08"
        }

        var widget =     {
            sizeY: 3,
            sizeX: 4,
            name: "Timeline",
            directive: "timeLine",
            directiveSettings: "timelinesettings",
            id: "timeline",
            icon: {
                id: "timeline",
                type: "fa-tasks"
            },
            main: true,
            settings: {
                active: false,
                timezones: {},
                grouporder: {
                    items1: []
                },
                events:[]
            },
            saveLoad: false,
            delete: false
        }

        widget.settings.timezones = [{
            name:"UTC",
            utcoffset : "+00:00",
            id:"utc",
            labeloffset : "+ 00"
        }];

        scope.saveSettings(widget);
        expect(scope.timezoneErrMsg).toEqual("");
        expect(scope.eventErrMsg).toEqual("");
        expect(widget.settings.timezones.length).toEqual(2);

    });

    it("should not save the changes made if close button is clicked in timezone selection",function(){
        scope.selected = {
            type: {
                value: 'Timezone'
            }
        }

        scope.selected.timezone = {
            name:"San Francisco",
            utcoffset: "-08:00",
            id:"sfo",
            labeloffset : "- 08"
        }

        var widget =     {
            sizeY: 3,
            sizeX: 4,
            name: "Timeline",
            directive: "timeLine",
            directiveSettings: "timelinesettings",
            id: "timeline",
            icon: {
                id: "timeline",
                type: "fa-tasks"
            },
            main: true,
            settings: {
                active: false,
                timezones: {},
                grouporder: {
                    items1: []
                },
                events:[]
            },
            saveLoad: false,
            delete: false
        }

        widget.settings.timezones = [{
            name:"UTC",
            utcoffset : "+00:00",
            id:"utc",
            labeloffset : "+ 00"
        }];

        scope.closeSettings(widget);
        expect(scope.timezoneErrMsg).toEqual("");
        expect(scope.eventErrMsg).toEqual("");
        expect(widget.settings.timezones.length).toEqual(1);
        expect(widget.main).toEqual(true);
        expect(widget.settings.active).toEqual(false);

    });

    it("should alert the user if no events are selected",function(){
        scope.selectByGroupModel = [];
        scope.selected = {
            type: {
                value: 'Events'
            }
        }
        var widget =     {
            sizeY: 3,
            sizeX: 4,
            name: "Timeline",
            directive: "timeLine",
            directiveSettings: "timelinesettings",
            id: "timeline",
            icon: {
                id: "timeline",
                type: "fa-tasks"
            },
            main: true,
            settings: {
                active: false,
                timezones: {},
                grouporder: {
                    items1: []
                },
                events:[]
            },
            saveLoad: false,
            delete: false
        }
        scope.saveSettings(widget);
        expect(scope.eventErrMsg).toEqual("Select atleast one event");
        expect(scope.timezoneErrMsg).toEqual("");

    });

    it("should save the events and its order when save is clicked",function(){
        scope.selectByGroupModel = [{
            "label":"A0_Launch"
        },{
            "label":"A1_Launch"
        }];
        scope.itemsList = {
            items1: []
        }
        scope.itemsList.items1 = [ 'A0','A1'
        ]
        scope.selected = {
            type: {
                value: 'Events'
            }
        }
        var widget =     {
            sizeY: 3,
            sizeX: 4,
            name: "Timeline",
            directive: "timeLine",
            directiveSettings: "timelinesettings",
            id: "timeline",
            icon: {
                id: "timeline",
                type: "fa-tasks"
            },
            main: true,
            settings: {
                active: false,
                timezones: {},
                grouporder: {
                    items1: []
                },
                events:[]
            },
            saveLoad: false,
            delete: false
        }
        scope.saveSettings(widget);
        expect(scope.eventErrMsg).toEqual("");
        expect(scope.timezoneErrMsg).toEqual("");

    });

    it("should not save the changes if the close button is clicked in event selection",function(){
        scope.selectByGroupModel = [{
            "label":"A0_Launch"
        },{
            "label":"A1_Launch"
        }];
        scope.itemsList = {
            items1: []
        }
        scope.itemsList.items1 = [ 'A0','A1'
        ]
        scope.selected = {
            type: {
                value: 'Events'
            }
        }
        var widget =     {
            sizeY: 3,
            sizeX: 4,
            name: "Timeline",
            directive: "timeLine",
            directiveSettings: "timelinesettings",
            id: "timeline",
            icon: {
                id: "timeline",
                type: "fa-tasks"
            },
            main: true,
            settings: {
                active: false,
                timezones: {},
                grouporder: {
                    items1: []
                },
                events:[]
            },
            saveLoad: false,
            delete: false
        }
        scope.closeSettings(widget);
        expect(scope.timezoneErrMsg).toEqual("");
        expect(scope.eventErrMsg).toEqual("");
        expect(widget.settings.events.length).toEqual(0);
        expect(widget.main).toEqual(true);
        expect(widget.settings.active).toEqual(false);
    });

})