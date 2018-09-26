app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataTableCtrl',['$scope','$mdSidenav','$window','$interval','$timeout','dashboardService','sidebarService','datastatesService', function ($scope,$mdSidenav,$window,$interval,$timeout,dashboardService,sidebarService,datastatesService) {  

    //Get values of the checkboxes in settings category display
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var tableCols = []; // table column data
    var tempvalue = [];
    $scope.dataStatus = dashboardService.icons;
    var dServiceObjVal = {};
    var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var textLeft = {'text-align':'left'};
    var textRight = {'text-align':'right'};
    var roweffect = { 
                        'background-color':'#CFCFD5',
                        'animation': 'background-fade 0.5s forwards',
                        '-webkit-animation': 'background-fade 0.5s forwards',
                        '-moz-animation': 'background-fade 0.5s forwards'
                    };
    $scope.arrow;
    var tempNum = 0;
    var valueReceived = false;
    $scope.currentIndex;
    $scope.askedForGroup;
    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);
    $scope.badSelectionErrMsg = "";
    $scope.errMsgStyles = {};

    // Default table structure -contains 120 rows to best appear for small and large screens
    createTableRows();

    function createTableRows(){
        var num_of_rows = 120;
        var dataObject = {
            contents: [
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedId",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedValue",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedUnits",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedNotes",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedChannel",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            }
            ],
            disabled: false
        }
        //Default table structure -contains 120 rows to best appear for small and large screens
        if($scope.widget.settings.data.length ===  0){
            for (var i = 0; i < num_of_rows; i++) {
                tableCols.push(angular.copy(dataObject));
                $scope.widget.settings.data[i] = new Object();
                $scope.widget.settings.previous[i] = new Object();      
            }
        }
        else {
            for (var i = 0; i < $scope.widget.settings.data.length; i++) {
                if($scope.widget.settings.data[i].hasOwnProperty("value")){
                    dataObject.value = $scope.widget.settings.data[i].value;
                    dataObject.type = $scope.widget.settings.data[i].type;
                    dataObject.undone = $scope.widget.settings.data[i].undone;
                    tableCols.push(angular.copy(dataObject));  
                }else {
                    tableCols.push(angular.copy(dataObject));
                }
            }
        }
    }

    //Function to select telemetry Id
    $scope.getTelemetrydata = function($event, $index, askedForGroup){
        sidebarService.setTempWidget($scope.widget, this); //pass widget and controller functions to sidebarService
        $scope.arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        $scope.arrow.style.color = "#07D1EA";
        $scope.currentIndex = $index;
        $scope.askedForGroup = askedForGroup;
        if ($window.innerWidth <= 1440){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
        sidebarService.setOpenLogo(false); //set to false if data menu opened through this Qwidget
    }

    $scope.getValue = function(isGroup)
    {
        if(isGroup && $scope.askedForGroup) //if the user has asked to see group and chosen a group from left sidebar
        {
            $scope.applyGroup();
            $scope.arrow.style.color = "#b3b3b3";
            $scope.errMsgStyles = {};
            $scope.badSelectionErrMsg = "";
        }
        else if(!isGroup && !$scope.askedForGroup) //if the user has asked to see telemetry id and chosen telemetry id from left sidebar
        {
            $scope.applyValue();
            $scope.arrow.style.color = "#b3b3b3";
            $scope.errMsgStyles = {};
            $scope.badSelectionErrMsg = "";
        }
        else if(!isGroup && $scope.askedForGroup) //if the user has asked to see group and has instead chosen telemetry id from left sidebar
        {
            $scope.arrow.style.color = "#07D1EA";
            $scope.badSelectionErrMsg = "Select a group from the data menu!";
            $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
        }
        $scope.widget.settings.dataArray = []; //once data has been added to table, reset dataArray
    }
    //Function to display selected telemetry Id value and its corresponding data values.
    $scope.applyValue = function(){
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.key) {
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value"))
                { 
                    if(savePrevious($scope.currentIndex)) //save info (if object not already created for this row, create it)
                    {  
                        $scope.widget.settings.data[$scope.currentIndex] = new Object();
                    }

                    $scope.widget.settings.data[$scope.currentIndex].type = "data";
                    $scope.widget.settings.data[$scope.currentIndex].value = data.key;
                    $scope.widget.settings.data[$scope.currentIndex].undone = false;
                        
                    $scope.arrow.style.color = "#b3b3b3";
                    if ($window.innerWidth > 1440)
                    {
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            }
        }
    }

    //function to assign key to specific row indices for the selected group
    $scope.applyGroup = function(){
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.key) {
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(!datavalue.hasOwnProperty("value")){
                    var idList = Object.keys(datavalue);


                    if($scope.table.rows[$scope.currentIndex]){
                        for(var a=1;a<idList.length;a++){
                            if(!$scope.table.rows[$scope.currentIndex+a]){
                                $scope.addRowBelow($scope.currentIndex); // add row below if row does not exist
                            }
                        }
                    }
                    for(var i=0; i<idList.length; i++){

                        if(savePrevious($scope.currentIndex + i)) //save info (if object not already created for this row, create it)
                        {
                            $scope.widget.settings.data[$scope.currentIndex + i] = new Object();
                        }

                        $scope.widget.settings.data[$scope.currentIndex + i].type = "data";
                        $scope.widget.settings.data[$scope.currentIndex + i].value = data.key + '.' + idList[i];
                        $scope.widget.settings.data[$scope.currentIndex + i].undone = false;
                    }

                    $scope.arrow.style.color = "#b3b3b3";
                    if ($window.innerWidth > 1440){
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            }
        }
    }

    //Function to add row above the current row
    $scope.addRowAbove = function($index){
        $scope.table.rows.splice($index,0,{contents :[
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedId",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedValue",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedUnits",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedNotes",
                    "active": "false"
                },
                {   
                    "datavalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedChannel",
                    "active": "false",
                    "datacolor":"",
                    "headervalue":""
                }
                ], 
                disabled:false 
            });
            $scope.widget.settings.data.splice($index, 0, {});
            $scope.widget.settings.previous.splice($index, 0, {});       
    }

    //Function to add below the current row
    $scope.addRowBelow = function($index){
            $scope.table.rows.splice($index+1,0,{contents :[
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedId",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedValue",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedUnits",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedNotes",
                    "active": "false"
                },
                {   
                    "datavalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedChannel",
                    "active": "false",
                    "datacolor":"",
                    "headervalue":""
                }
                ],
                disabled:false 
            });
            $scope.widget.settings.data.splice($index+1, 0, {}); 
            $scope.widget.settings.previous.splice($index+1, 0, {});        
    }

    //Function to delete the current row.
    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.table.rows.length) === 1){
            $window.alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            $scope.table.rows.splice($index, 1);
            $scope.widget.settings.data.splice($index,1);
            $scope.widget.settings.previous.splice($index,1);
        }
    }

    //Function to move row above.
    $scope.moveRowUp = function($index){
        if($index > 0){
            $scope.table.rows[$index-1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index-1])[0];
            $scope.widget.settings.data[$index-1] = $scope.widget.settings.data.splice($index, 1, $scope.widget.settings.data[$index-1])[0];
            $scope.table.rows[$index-1].colorin = roweffect;

            $scope.widget.settings.previous[$index-1] = $scope.widget.settings.previous.splice($index, 1, $scope.widget.settings.previous[$index-1])[0];

            $timeout(function() {
                $scope.table.rows[$index-1].colorin = '';
            }, 500);
        }
        else{
            $window.alert("This row cannot be moved further up!");
        }
    }

    //Function to move row down.
    $scope.moveRowDown = function($index){
        if(($index) < (($scope.table.rows.length)-1)){
            $scope.table.rows[$index+1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index+1])[0];
            $scope.widget.settings.data[$index+1] = $scope.widget.settings.data.splice($index, 1, $scope.widget.settings.data[$index+1])[0];
            $scope.table.rows[$index+1].colorin = roweffect; 

            $scope.widget.settings.previous[$index+1] = $scope.widget.settings.previous.splice($index, 1, $scope.widget.settings.previous[$index+1])[0];

            $timeout(function() {
                $scope.table.rows[$index+1].colorin = '';
            }, 500);  
        }
        else{
            //$window.alert("This row cannot be moved further down! You have reached the end of the table.");
        }
    }

    //Function to convert a row to a header
    $scope.convertHeader = function($index, header){
        if(savePrevious($index)) //save info (if object not already created for this row, create it)
        {
            $scope.widget.settings.data[$index] = new Object();
        }
        createHeader($index, header); //actually create the header
        $scope.widget.settings.data[$index].undone = false;
    } 

    //create the header without saving current row in "data" into "previous"
    function createHeader($index, header)
    {
        var data = "";
        if(header)
        {
            data = header.data;
        }
        $scope.table.rows[$index] = {
            contents:[{
                "datavalue":"",
                "headervalue": {"data": data },
                "checked":"false",
                "style":"text-align:right;background-color:#1072A4;",
                "colshow":"true",
                "colspan":"9",
                "class":"header",
                "placeholder":"Click here to edit",
                "active":"true"
            }],
            disabled: true
        };
        $scope.widget.settings.data[$index].type = "header";
        $scope.widget.settings.data[$index].value = $scope.table.rows[$index].contents[0].headervalue;
    }

    //Table row and column structure
    checkForRowData();

    //Undo apply telemetry Id or convert to header
    $scope.undo = function($index) {
        //store current row in "previous" as temp
        var tempType = $scope.widget.settings.previous[$index].type;
        var tempValue = $scope.widget.settings.previous[$index].value;
            
        //save current row in "previous" as the current row in "data"
        $scope.widget.settings.previous[$index] = new Object();
        $scope.widget.settings.previous[$index].type = $scope.widget.settings.data[$index].type;
        $scope.widget.settings.previous[$index].value = $scope.widget.settings.data[$index].value;

        //save current row in "data" as temp
        $scope.widget.settings.data[$index] = new Object();
        $scope.widget.settings.data[$index].type = tempType;
        $scope.widget.settings.data[$index].value = tempValue;

        var dataObj = {
            contents: [
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedId",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedValue",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedUnits",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedNotes",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedChannel",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            }
            ],
            disabled: false
        }

        //create header if new current row in "data" says so
        if(tempType == "header")
        {
            createHeader($index, tempValue);
        }
        else //otherwise create a data object in the current row
        {
            $scope.table.rows[$index] = angular.copy(dataObj);
        }

        //now this has been undone, don't allow option to undo again
        $scope.widget.settings.data[$index].undone = true;
    }

    //save current data type and value into previous type and value
    function savePrevious(index)
    {
        if($scope.widget.settings.data[index]) //no need to create new object in previous if object already has been made
        {
            if($scope.widget.settings.data[index].hasOwnProperty("value")){
                $scope.widget.settings.previous[index].type = $scope.widget.settings.data[index].type;
                $scope.widget.settings.previous[index].value = $scope.widget.settings.data[index].value;
                return false;
            }else {
                // $scope.widget.settings.previous[index] = new Object();
                $scope.widget.settings.previous[index].type = "";
                $scope.widget.settings.previous[index].value = "";
                return true;
            }
        }
    }

    function checkForRowData(){
        $scope.table = { 
            "rows" : tableCols 
        };

        if($scope.widget.settings.data.length != 0){
            for (var i=0; i<$scope.widget.settings.data.length; i++){
                if($scope.widget.settings.data[i] && $scope.widget.settings.data[i].type == "header") {
                    createHeader(i, $scope.widget.settings.data[i].value);
                }
            }
        }

    } 

    $scope.updateRow = function() {
        for (var i=0; i<$scope.table.rows.length; i++){
            var tempRow = $scope.table.rows[i];
            var data = $scope.widget.settings.data[i];
            if(data) {
                //update values if the row type is data, not header
                if(data.type == "data"){
                    var key = data.value;
                    tempRow.contents[8].datavalue = key;
                    try {
                        //id is the last/leaf node of the dot separated key.
                        var id = key.split('.').slice(-1)[0];

                        var currentData = dashboardService.getData(key);
                        if(currentData) {
                            var valType = typeof currentData.value;
                            if(valType === "number"){
                                currentData.value = parseFloat(currentData.value.toFixed(4));
                            }

                            tempRow.contents[0].datavalue = id;

                            if(currentData.alarm_low){
                                tempRow.contents[1].datavalue = currentData.alarm_low;
                            }else {
                                tempRow.contents[1].datavalue = 'N/A';
                            }

                            if(currentData.warn_low){
                                tempRow.contents[2].datavalue = currentData.warn_low;
                            }else {
                                tempRow.contents[2].datavalue = 'N/A';
                            }

                            tempRow.contents[3].datavalue = currentData.value;
                            if(tempvalue[i] === currentData.value){
                                //stale data
                                if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && 
                                    dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green" ){
                                        tempRow.contents[3].datacolor = colorHealthy;
                                } else {
                                    tempRow.contents[3].datacolor = colorStale;
                                }
                            } else {
                                //new data
                                var colorVal = datastatesService.getDataColor(currentData.alarm_low, currentData.alarm_high,
                                                    currentData.value, currentData.warn_low, currentData.warn_high, valType)
                                if(colorVal === "red"){
                                    tempRow.contents[3].datacolor = colorAlarm;
                                }else if(colorVal === "orange"){
                                    tempRow.contents[3].datacolor = colorCaution;
                                }else{
                                    tempRow.contents[3].datacolor = colorHealthy;
                                }
                                tempvalue[i] = currentData.value;
                            } 

                            if(currentData.warn_high){
                                tempRow.contents[4].datavalue = currentData.warn_high;
                            }else {
                                tempRow.contents[4].datavalue = 'N/A';
                            }

                            if(currentData.alarm_high){
                                tempRow.contents[5].datavalue = currentData.alarm_high;
                            }else {
                                tempRow.contents[5].datavalue = 'N/A';
                            }

                            tempRow.contents[6].datavalue = currentData.units;

                            if(currentData.notes !== ''){
                                tempRow.contents[7].datavalue = currentData.notes;
                            }else {
                                tempRow.contents[7].datavalue = 'N/A';
                            }
                        }
                    } catch(err){
                    
                    }
                }
            } else {
                if(dServiceObjVal.dIcon === "red"){
                    //GUI Disconnected with Database 
                    tempRow.contents[0].datacolor = colorDisconnected;
                    tempRow.contents[1].datacolor = colorDisconnected;
                    tempRow.contents[2].datacolor = colorDisconnected;
                    tempRow.contents[3].datacolor = colorDisconnected;
                    tempRow.contents[4].datacolor = colorDisconnected;
                    tempRow.contents[5].datacolor = colorDisconnected;
                    tempRow.contents[6].datacolor = colorDisconnected;
                    tempRow.contents[7].datacolor = colorDisconnected;
                }
            }
        }
    }

    $scope.interval = $interval($scope.updateRow, 1000, 0, false);

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );

}]);