app
.factory('gridService', function() { 
    var gridsterOptions = {
        margins: [20, 20],
        columns: 8,
        draggable: {
            enabled: true,
            handle: '.box-header'
        }
    };

    var widgetDefinitions = [
    {
        sizeY: 2,
        sizeX: 2,
        name: "Ground Track",
        directive: "groundtrack",
        id: "addGround",
        icon: {
            id: "g-track",
            type: "fa-globe"
        }
    }, 
    {
        sizeY: 2,
        sizeX: 2,
        name: "Telemetry Table",
        directive: "tabletext",
        id: "addtablewidget",
        icon: {
            id: "t-table",
            type: "fa-table"
        }
    }, 
    {
        sizeY: 2,
        sizeX: 2,
        name: "Search By Id",
        directive: "searchtable",
        id: "searchId",
        icon: {
            id: "s-table",
            type: "fa-search"
        }
    },
    {
        sizeY: 2,
        sizeX: 2,
        name: "Line Plot",
        directive: "lineplot",
        id: "addLine",
        icon: {
            id: "l-plot",
            type: "fa-line-chart"
        }
    },
    {
        sizeY: 2,
        sizeX: 2,
        name: "Data Table",
        directive: "datatable",
        id: "datatable",
        icon: {
            id: "d-table",
            type: "fa-table"
        }
    }];

    var dashboards = {
        '1': {
            id: '1',
            name: 'Home',
            widgets: [{
                col: 0,
                row: 0,
                sizeY: 2,
                sizeX: 2,
                name: "Telemetry Table",
                directive: "tabletext",
                id: "addtablewidget",
                icon: {
                    id: "t-table",
                    type: "fa-table"
                },
                option: ""
            }, 
            {
                col: 2,
                row: 1,
                sizeY: 2,
                sizeX: 2,
                name: "Ground Track",
                directive: "groundtrack",
                id: "addGround",
                icon: {
                    id: "g-track",
                    type: "fa-globe"
                },
                option: ""
            },
            {
                col: 4,
                row: 1,
                sizeY: 2,
                sizeX: 2,
                name: "Search By Id",
                directive: "searchtable",
                id: "searchId",
                icon: {
                    id: "s-table",
                    type: "fa-search"
                },
                option: ""
            }]
        }
    };

    var dashboard = dashboards[1];

    var selectedDashboardId = '1';

    function getDashboard() {
        return dashboard;
    }

    function setDashboard(d1) {
        dashboard = d1;
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
        dashboards[selectedDashboardId].widgets.push({
            name: widget.name,
            sizeX: widget.sizeX,
            sizeY: widget.sizeY,
            directive: widget.directive,
            id: widget.id,
            icon: {
                id: widget.icon.id,
                type: widget.icon.type
            }
        });
    }

    function remove(widget) {
        dashboard.widgets.splice(dashboard.widgets.indexOf(widget), 1);
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
        remove : remove
	}
});