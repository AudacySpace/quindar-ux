app
.factory('gridService', ['$http', function($http) { 
    var gridsterOptions = {
        margins: [20, 20],
        columns: 8,
        draggable: {
            enabled: true,
            handle: '.box-header'
        }
    };

    var satvehicles = [
            {
                'key': 1,
                'value': 'Audacy1'
            }, 
            {
                'key': 2,
                'value': 'Audacy2'
            }, 
            {
                'key': 3,
                'value': 'Audacy3'
            }
    ];      

    var orbitDisplay = [];
    var iconDisplay = [];
    for(var i=0;i<3;i++){
        orbitDisplay[i] = true;
        iconDisplay[i] = true;
    }

    var groundtracktableCols = [];
    for (var i = 1; i < 4; i++) {
        groundtracktableCols.push({
                            contents:   [
                                            {   
                                                "value": i,
                                                "style":"text-align:left;background-color:#fff;color:#000;font-size:14px;margin-left:2px",
                                                "active": "false"
                                            },
                                            {   
                                                "value":"Audacy"+i,
                                                "style":"text-align:left;background-color:#fff;color:#000;font-size:14px",
                                                "active": "false"
                                            },
                                            {   
                                                "value":"",
                                                "style":"text-align:left;background-color:#fff;color:#000;margin-top:0px",
                                                "active": "true"
                                            },
                                            {   
                                                "value":"",
                                                "style":"text-align:left;background-color:#fff;color:#000",
                                                "active": "true"
                                            },
                                            {   
                                                "value":"",
                                                "style":"text-align:left;background-color:#fff;color:#000",
                                                "active": "true"
                                            }
                                        ],
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
            active: false
        },
		saveLoad: false,
		delete: false
    },
    {
        sizeY: 2,
        sizeX: 4,
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
        sizeX: 3,
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
        sizeY: 4,
        sizeX: 6,
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
        sizeX: 3,
        name: "Clock",
        directive: "clock",
        directiveSettings: "clocksettings",
        id: "clock",
        icon: {
            id: "l-plot",
            type: "fa-clock-o"
        },
        main: true,
        settings: {
            active: false
        },
        saveLoad: false,
        delete: false
    }];

    var dashboards = {
        'Home': {
            name: 'Home',
            widgets: [
            {
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
                        colors: ["#172168","#172168","#172168"],
                        vehicles : [],
                        linecolors : [],
                        plotData : {},
                        checkedValues : ["false","false","false"],
                        satvehicles : satvehicles
                    },
                    saveLoad: false,
                    delete: false
                },
                {
                    col: 4,
                    row: 0,
                    sizeY: 3,
                    sizeX: 3,
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
                }
                ]
            }
        };

    var dashboard = {"current" : dashboards['Home']};

    var selectedDashboardId = 'Home';

    function getDashboard() {
        return dashboard;
    }

    function setDashboard(d1) {
        dashboard["current"] = d1;
    }

    function getDashboardId() {
        return selectedDashboardId;
    }

    function setDashboardId(id1) {
        selectedDashboardId = id1;
    }

    function clear() {
        dashboards[selectedDashboardId].widgets = [];
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
        dashboards[selectedDashboardId].widgets.push(widgetdef);
    }

    function remove(widget) {
        dashboard["current"].widgets.splice(dashboard["current"].widgets.indexOf(widget), 1);
    }

    function save(email, dName) {
        dashboard["current"].name = dName;
        return $http({
            url: "/saveLayout", 
            method: "POST",
            data: {"email" : email, "dashboard" : dashboard["current"]}
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
            dashboards[name] = layouts[i];
        }
        
        dashboard["current"] = dashboards[layout.name];
        selectedDashboardId = layout.name;
    }

	return {
        gridsterOptions : gridsterOptions,
        dashboards : dashboards,
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