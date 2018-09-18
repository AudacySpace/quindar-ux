
function gridService ($http, $sessionStorage, $window, userService) { 
    var gridsterOptions = {
        margins: [20, 20],
        columns: 8,
        draggable: {
            enabled: true,
            handle: '.box-header'
        }
    }; 

    var email = userService.getUserEmail();

    var loaders = {
        gridLoader: false
    };

    checkDefaultDashboard();

    var widgetDefinitions = [
    {
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
        main: true,
		settings: {
            active: false,
            data : {
                vehicles : [],
                value : "", 
                key: ""
            },
            dataArray: []
        },
		saveLoad: false,
		delete: false
    },
    {
        sizeY: 3,
        sizeX: 4,
        maxSizeY:3,
        name: "Data Table",
        directive: "datatable",
		directiveSettings: "datatablesettings",
        id: "datatable",
        icon: {
            id: "d-table",
            type: "fa-table"
        },
        main: true,
		settings: {
            active: false,
            checkedValues:{
                checkedId: true,
                checkedAlow: true,
                checkedWlow: true,
                checkedValue: true,
                checkedWhigh: true,
                checkedAhigh: true,
                checkedUnits: true,
                checkedNotes: true,
                checkedChannel: false
            },
            data : [],
            previous : [],
            dataArray: []
        },
		saveLoad: false,
		delete: false
    },    
    {
        sizeY: 3,
        sizeX: 4,
        name: "3D Model",
        directive: "satellite",
        directiveSettings: "satellitesettings",
        id: "satellite",
        icon: {
            id: "l-plot",
            type: "fa-cube"
        },
        main: true,
        settings: {
            active: false,
            dataArray: [],
            totalAttitudeArray: [],
            totalPositionArray: []
        },
        saveLoad: false,
        delete: false
    },
    {
        sizeY: 3,
        sizeX: 4,
        name: "Ground Track",
        directive: "groundtrack",
        directiveSettings: "groundtracksettings",
        id: "groundtrack",
        icon: {
            id: "g-track",
            type: "fa-globe"
        },
        main: true,
        settings: {
            active: false,
            vehicles : [],
            dataArray: [],
            totalPositionArray: [],
            totalVelocityArray: []
        },
        saveLoad: false,
        delete: false
    },
    {
        sizeY: 3,
        sizeX: 4,
        name: "Clock",
        directive: "clock",
        directiveSettings: "clocksettings",
        id: "clock",
        icon: {
            id: "clock",
            type: "fa-clock-o"
        },
        main: true,
        settings: {
            active: false
        },
        saveLoad: false,
        delete: false
    },
    {
        sizeY: 3,
        sizeX: 4,
        name: "Data Log",
        directive: "datalog",
        directiveSettings: "datalogsettings",
        id: "datalog",
        icon: {
            id: "d-log",
            type: "fa-list-alt"
        },
        main: true,
        settings: {
            active: false,
            dataArray: []
        },
        saveLoad: false,
        delete: false
    },
    {
        sizeY: 3,
        sizeX: 4,
        name: "Alarm Panel",
        directive: "alarmpanel",
        directiveSettings: "alarmpanelsettings",
        id: "alarmpanel",
        icon: {
            id: "alarm",
            type: "fa-tachometer"
        },
        main: true,
        settings: {
            active: false,
            statusboard: true
        },
        saveLoad: false,
        delete: false
    },   
    {
        sizeY: 3,
        sizeX: 8,
        name: "System Map",
        directive: "systemmap",
        directiveSettings: "systemmapsettings",
        id: "systemmap",
        icon: {
            id: "systemmap",
            type: "fa-map-o"
        },
        main: true,
        settings: {
            active: false,
        },
        saveLoad: false,
        delete: false
    },
    {
        sizeY: 3,
        sizeX: 4,
        name: "Command",
        directive: "command",
        directiveSettings: "commandsettings",
        id: "command",
        icon: {
            id: "alarm",
            type: "fa-window-maximize"
        },
        main: true,
        settings: {
            active: false,
            commandlog: true,
            dataArray: []
        },
        saveLoad: false,
        delete: false
    },
    {
        sizeY: 3,
        sizeX: 8,
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
            active: false
        },
        saveLoad: false,
        delete: false

    }
    ];

    function checkDefaultDashboard(){

        if(!$sessionStorage.dashboard || $sessionStorage.dashboard === null || $sessionStorage.dashboard === ''){
            $sessionStorage.dashboards = {
                'Home': {
                    name: 'Home',
                    mission:{
                        missionName: '',
                        missionImage: ''
                    },
                    widgets: [{
                        col: 0,
                        row: 0,
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
                        main: true,
                        settings: {
                            active: false,
                            data : {
                                vehicles : [],
                                value : "",
                                key : ""
                            },
                            dataArray: []
                        },
                        saveLoad: false,
                        delete: false
                    },
                    {
                        col: 4,
                        row: 0,
                        sizeY: 3,
                        sizeX: 4,
                        name: "3D Model",
                        directive: "satellite",
                        directiveSettings: "satellitesettings",
                        id: "satellite",
                        icon: {
                            id: "l-plot",
                            type: "fa-cube"
                        },
                        main: true,
                        settings: {
                            active: false,
                            dataArray: [],
                            totalAttitudeArray: [],
                            totalPositionArray: []
                        },
                        saveLoad: false,
                        delete: false
                    }]
                }
            }
            $sessionStorage.dashboard = {"current" : angular.copy($sessionStorage.dashboards['Home'])};
        } 
        $window.document.title = "Quindar - " + $sessionStorage.dashboard.current.name;
    }

    var selectedDashboardId = 'Home';

    function getDashboard() {
        return $sessionStorage.dashboard;
    }

    function setDashboard(d1) {
        $sessionStorage.dashboard["current"] = d1;
    }

    function getDashboardId() {
        return selectedDashboardId;
    }

    function setDashboardId(id1) {
        selectedDashboardId = id1;
    }

    function clear() {
        $sessionStorage.dashboard["current"].widgets = [];
    };

    function addWidget() {
        dashboards[selectedDashboardId].widgets.push({
            name: "New Widget",
            sizeX: 1,
            sizeY: 1
        });
    };

    function addWidgets(widget) {
        var widgetdef = angular.copy(widget);
        $sessionStorage.dashboard["current"].widgets.push(widgetdef);
    }

    function remove(widget) {      
        $sessionStorage.dashboard["current"].widgets.splice($sessionStorage.dashboard["current"].widgets.indexOf(widget), 1);
    }

    function save(email, dName) {
        $sessionStorage.dashboard["current"].name = dName;
        return $http({
            url: "/saveLayout", 
            method: "POST",
            data: {"email" : email, "dashboard" : $sessionStorage.dashboard["current"]}
        });
    }

    function load(email) {
        return $http({
            url: "/loadLayout", 
            method: "GET",
            params: {"email" : email,"missionname" : $sessionStorage.dashboard["current"].mission.missionName}
        });
    }

    function showLayout(layouts, layout) {
        for(var i=0; i<layouts.length; i++){
            var name = layouts[i].name;
            $sessionStorage.dashboards[name] = angular.copy(layouts[i]);
        }
        $sessionStorage.dashboard["current"] = angular.copy($sessionStorage.dashboards[layout.name]);
        selectedDashboardId = layout.name;
    }

    function setMissionForLayout(mname){
        $sessionStorage.dashboard["current"].mission.missionName = mname;
        if($sessionStorage.dashboard["current"].mission.missionName !== ""){
            var sessionimage = getMissionImage($sessionStorage.dashboard["current"].mission.missionName);
            $sessionStorage.dashboard["current"].mission.missionImage = sessionimage;
        }

        setMissionForUser(mname);
    }

    function setMissionForUser(mname){
        userService.setMissionForUser(email, mname)
        .then(function(response){
            userService.userRole.cRole = response.data.currentRole;
        });
    }

    function getMissionImage(mname){
        var image = "";
        if(mname === "AZero" || mname === "AudacyZero" || mname === "Audacy Zero" || mname === "A Zero" || mname === "A0"){
            image = "/media/icons/AudacyZero_Logo_White.jpg";
            return image;
        }else {
            image = "/media/icons/Audacy_Icon_White.svg";
            return image;
        }
    }

    function loadMaps(){
        return $http({
            url: "/loadSystemMaps", 
            method: "GET",
            params: {"mission" :$sessionStorage.dashboard["current"].mission.missionName}
        });
    }

    function loadTimelineEvents(){
        return $http({
            url: "/loadTimelineEvents", 
            method: "GET",
            params: {"mission" :$sessionStorage.dashboard["current"].mission.missionName}
        });
    }

    function setGridLoader(loadStatus){
        loaders.gridLoader = loadStatus;
    }

    function getGridLoader(){
        return loaders;
    }

	return {
        gridsterOptions : gridsterOptions,
        clear : clear,
        addWidget : addWidget,
        getDashboard : getDashboard,
        getDashboardId : getDashboardId,
        setDashboard : setDashboard,
        setDashboardId : setDashboardId,
        addWidgets : addWidgets,
        widgetDefinitions : widgetDefinitions,
        setMissionForLayout : setMissionForLayout,
        setMissionForUser : setMissionForUser,
        remove : remove, 
        save : save,
        load : load,
        showLayout : showLayout,
        getMissionImage : getMissionImage,
        loadMaps : loadMaps,
        loadTimelineEvents : loadTimelineEvents,
        setGridLoader : setGridLoader,
        getGridLoader : getGridLoader
	}
}

app
.factory('gridService', gridService); 