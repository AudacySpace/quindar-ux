app
.factory('gridService', ['$http','$sessionStorage','prompt','userService', function($http,$sessionStorage,prompt,userService) { 
    var gridsterOptions = {
        margins: [20, 20],
        columns: 8,
        draggable: {
            enabled: true,
            handle: '.box-header'
        }
    };     

    var email = userService.getUserEmail();
    checkDefaultDashboard();

    var groundtracktableCols = [];
    for (var i = 1; i < 4; i++) {
        groundtracktableCols.push({
                            contents:   [
                                            {   
                                                "value": i,
                                                "style":"text-align:left;background-color:#fff;color:#000;font-size:13px;margin-left:2px",
                                                "active": "false",
                                                "cstyle":"background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                "cstatus":"false"
                                            },
                                            {   
                                                "value":"Audacy"+i,
                                                "style":"text-align:left;background-color:#fff;color:#000;font-size:13px",
                                                "active": "false",
                                                "cstyle":"background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                "cstatus":"false"
                                            },
                                            {   
                                                "value":"",
                                                "style":"text-align:left;background-color:#fff;color:#000;margin-top:0px",
                                                "active": "true",
                                                "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                "cstatus":"true"
                                            },
                                            {   
                                                "value":"",
                                                "style":"text-align:left;background-color:#fff;color:#000",
                                                "active": "true",
                                                "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                "cstatus":"true"
                                            },
                                            {   
                                                "value":"",
                                                "style":"text-align:left;background-color:#fff;color:#000",
                                                "active": "true",
                                                "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                "cstatus":"true"
                                            }
                                        ]
                                        ,
                                        status: [
                                        idStatus = false,
                                        nameStatus = false,
                                        dataStatus = true,
                                        orbitStatus = true,
                                        iconStatus = true]
                       }); 
    }                        

    var widgetDefinitions = [
    {
        sizeY: 3,
        sizeX: 4,
        name: "Line Plot",
        directive: "lineplot",
		directiveSettings: "linesettings",
        id: "addLine",
        icon: {
            id: "l-plot",
            type: "fa-line-chart"
        },
        main: true,
		settings: {
            active: false,
            checkedVehicles : [
                                {
                                    'key': 1,
                                    'value': 'Audacy1',
                                    'checked': false,
                                    'color' : '#0AACCF'
                                }, 
                                {
                                    'key': 2,
                                    'value': 'Audacy2',
                                    'checked': true,
                                    'color' : '#FF9100'
                                }, 
                                {
                                    'key': 3,
                                    'value': 'Audacy3',
                                    'checked': false,
                                    'color' : '#64DD17'
                                }
                            ]
        },
		saveLoad: false,
		delete: false
    },
    {
        sizeY: 2,
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
                checkedName: true,
                checkedAlow: true,
                checkedWlow: true,
                checkedValue: true,
                checkedWhigh: true,
                checkedAhigh: true,
                checkedUnits: true,
                checkedNotes: true
            }
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
            active: false
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
            contents : groundtracktableCols,
            vehName :[],
            scHolder :{},
            scStates :{},
            dataHolder :[],
            orbitHolder :[],
            iconHolder :[]
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
            active: false
        },
        saveLoad: false,
        delete: false
     }];

    function checkDefaultDashboard(){

        if(!$sessionStorage.dashboard || $sessionStorage.dashboard === null || $sessionStorage.dashboard === ''){
            $sessionStorage.dashboards = {
                'Home': {
                    name: 'Home',
                    widgets: [{
                        col: 0,
                        row: 0,
                        sizeY: 3,
                        sizeX: 4,
                        name: "Line Plot",
                        directive: "lineplot",
                        directiveSettings: "linesettings",
                        id: "addLine",
                        icon: {
                            id: "l-plot",
                            type: "fa-line-chart"
                        },
                        main: true,
                        settings: {
                            active: false,
                            checkedVehicles : [
                                {
                                    'key': 1,
                                    'value': 'Audacy1',
                                    'checked': false,
                                    'color' : '#0AACCF'
                                }, 
                                {
                                    'key': 2,
                                    'value': 'Audacy2',
                                    'checked': true,
                                    'color' : '#FF9100'
                                }, 
                                {
                                    'key': 3,
                                    'value': 'Audacy3',
                                    'checked': false,
                                    'color' : '#64DD17'
                                }
                            ]
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
                            active: false
                        },
                        saveLoad: false,
                        delete: false
                    }]
                }
            }

            $sessionStorage.dashboard = {"current" : $sessionStorage.dashboards['Home']};
        }

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
        $sessionStorage.dashboards[selectedDashboardId].widgets = [];
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
        $sessionStorage.dashboards[selectedDashboardId].widgets.push(widgetdef);
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
            params: {"email" : email}
        });
    }

    function showLayout(layouts, layout) {
        for(var i=0; i<layouts.length; i++){
            var name = layouts[i].name;
            $sessionStorage.dashboards[name] = layouts[i];
        }
        $sessionStorage.dashboard["current"] = $sessionStorage.dashboards[layout.name];
        selectedDashboardId = layout.name;
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
        remove : remove, 
        save : save,
        load : load,
        showLayout : showLayout
	}
}]);