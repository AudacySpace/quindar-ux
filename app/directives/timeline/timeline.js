app
.directive('timeline', function() { 
	return { 
    	restrict: 'EA', 
		controller: 'timelineCtrl',
    	templateUrl: './directives/timeline/timeline.html'
    }
});

app.controller('timelineCtrl', function (gridService,$scope,$interval,dashboardService,$element) {

    var globalgroups = [] ;
    var names = [];
    // create a data set with groups
    var groups = new vis.DataSet();
    var items = new vis.DataSet();

    // create visualization
    var container = $element[0].getElementsByTagName("div")["visualization"];
    var timeline = new vis.Timeline(container);

    $scope.tztimeline = [];
    $scope.tzcontainer = [];
    $scope.tzgroups = [];
    $scope.tzoptions = [];

    var outercontainer = $element[0].getElementsByTagName("div")["timeline"];
    $scope.datetime = "";

    checkForTimezoneData();

    $scope.$watch("widget.settings.timezones",function(newval,oldval){
        checkForTimezoneData();
    },true);

    $scope.$watch("widget.settings.events",function(newval,oldval){
        if(newval !== undefined){
            displayEvents(newval,$scope.widget.settings.grouporder);
        }          
    },true);

    $scope.$watch("widget.settings.grouporder",function(newval,oldval){
        if(newval !== undefined){
            displayEvents($scope.widget.settings.events,newval);
        }          
    },true);


    //Function to load events and its order whenever user has changed in settings
    function displayEvents(events,eventorder){
        var tempnames = [];
        var tcount = 0;
        names = [];
        groups = new vis.DataSet();
        items =  new vis.DataSet();

        for(var c=0;c<eventorder.items1.length;c++){
            for(var b=0;b<events.length;b++){
                if(eventorder.items1[c].groupstatus === false){
                    if(eventorder.items1[c].Label === events[b].label){
                        tempnames.push({
                            id:events[b].id,
                            label:eventorder.items1[c].Label,
                            group:"Other"
                        });
                    }

                }else {
                    if(eventorder.items1[c].Label === events[b].group){
                        tempnames.push({
                            id:events[b].id,
                            label:events[b].label,
                            group:events[b].group
                        });
                    }
                }
            }
        }
        names = buildEventProperties(tempnames);
        var grps = createEvents(groups,names,eventorder.items1);
        var itms = createEventTimeline(items,grps,tempnames);
        $scope.options = gettimelineOptions();
        timeline.setOptions($scope.options);
        timeline.setOptions({orientation: {axis: "none"}});
        timeline.setGroups(grps);
        timeline.setItems(itms);

        if(!$scope.widget.settings.start && !$scope.widget.settings.start){
            $scope.options = gettimelineOptions();
            $scope.widget.settings.start = $scope.options.start;
            $scope.widget.settings.end = $scope.options.end;
        }else {
            $scope.options = gettimelineOptions();
        } 
    }

    //Function to display timezones selected using settings menu.
    function checkForTimezoneData(){ 
        $scope.timezones = new Array();
        $scope.tztimeline = [];
        $scope.tzcontainer = [];
        $scope.tzgroups = [];
        $scope.tzoptions = [];
        var outercontainer = $element[0].getElementsByTagName("div")["timeline"];

        if($scope.widget.settings.start && $scope.widget.settings.end){
            $scope.options = gettimelineOptions();
        }       
        if(!$scope.widget.settings.timezones || $scope.widget.settings.timezones.length === 0){
            $scope.widget.settings.timezones = [
                {
                    name:"UTC",
                    utcoffset : "+00:00",
                    id:"utc",
                    labeloffset : "+ 00"
                }];
        }

        for(var t=0;t<$scope.widget.settings.timezones.length;t++){
            $scope.timezones.push($scope.widget.settings.timezones[t]);
        }

        while (outercontainer.firstChild) {
            outercontainer.removeChild(outercontainer.firstChild);
        }

        for(var a=0;a<$scope.timezones.length;a++){
            $scope.tzcontainer[a] = document.createElement("div");
            $scope.tzcontainer[a].className = "tzgroup";
            outercontainer.insertBefore($scope.tzcontainer[a], outercontainer.childNodes[outercontainer.childNodes.length]);
            var newtimeline = new vis.Timeline($scope.tzcontainer[a]);
            $scope.tztimeline.push(newtimeline);

            if($scope.widget.settings.start && $scope.widget.settings.end){
                 $scope.tzoptions.push({
                    start : $scope.widget.settings.start,
                    end : $scope.widget.settings.end,
                    orientation: {axis: "top"},
                    moveable : false,
                    zoomable : false
                 });
            }else {
                $scope.tzoptions.push({
                    start : new Date(vis.moment(dashboardService.getTime(0).today).utcOffset($scope.timezones[a].utcoffset) - 1000 * 60 * 60),
                    end : new Date(vis.moment(dashboardService.getTime(0).today).utcOffset($scope.timezones[a].utcoffset) + 1000 * 60 * 60),
                    orientation: {axis: "top"},
                    moveable : false,
                    zoomable : false
                });
            }

            var grp = new vis.DataSet();
            var opt = "";
            var name = $scope.timezones[a].name;
            $scope.tzgroups.push(grp);

            if(name === "San Francisco"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("-08:00");
                    }  
                };
            }else if(name === "Singapore"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+08:00");
                    }  
                };
            }else if(name === "UTC"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+00:00");
                    }  
                };
            }else if(name === "Luxembourg"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+02:00");
                    }  
                };
            }else {
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+00:00");
                    }  
                };
            }

            $scope.tztimeline[a].setOptions($scope.tzoptions[a]);
            $scope.tztimeline[a].setOptions(opt);
            $scope.tzgroups[a].add({id:0,content:$scope.timezones[a].name+" (UTC "+$scope.timezones[a].labeloffset+")"});
            $scope.tztimeline[a].setGroups($scope.tzgroups[a]);
        }
    }

    //Event Listener to listen to change in the main timeline window range and move the timezone range accordingly
    timeline.on('rangechanged', function (properties) {
        for(var i=0;i<$scope.timezones.length;i++){
            try{
                $scope.tztimeline[i].setWindow(properties.start, properties.end);
            }catch(e){
                console.log(e);
            }
        }
        $scope.widget.settings.start = properties.start;
        $scope.widget.settings.end = properties.end;
    });

    //Function to Display current time using current mission time every second
    $scope.updateClock = function(){
        if(dashboardService.getTime(0).today){
            //sets current time in all timezones of the timeline 
            timeline.setCurrentTime(vis.moment(dashboardService.getTime(0).today).utc());
            if($scope.timezones.length >0){
                for(var i=0;i<$scope.timezones.length;i++){
                    try{
                         $scope.tztimeline[i].setCurrentTime(vis.moment(dashboardService.getTime(0).today).utcOffset($scope.timezones[i].utcoffset));
                    }catch(e){
                        console.log(e);
                    }
                }
            }
            if($scope.widget.settings.datetime === "" || $scope.widget.settings.datetime === undefined){
                $scope.realtimebutton = { 
                    style : {
                        background:'#12C700'
                    }
                };
            }else {
                $scope.datetime = $scope.widget.settings.datetime;
            }
        }
    }

    $scope.interval = $interval($scope.updateClock, 1000);

    //Function to change date time using date time button on the widget and pan to that range.
    $scope.changetime = function(){
        if($scope.datetime){
            $interval.cancel($scope.interval);
            timeline.setOptions({start: new Date(vis.moment($scope.datetime).utc() - 1000 * 60 * 60),end:new Date(vis.moment($scope.datetime).utc() + 1000 * 60 * 60) });
            if($scope.timezones.length > 0){
                for(var i=0;i<$scope.timezones.length;i++){
                    try{
                         $scope.tztimeline[i].setOptions({start: new Date(vis.moment($scope.datetime).utcOffset($scope.timezones[i].utcoffset) - 1000 * 60 * 60),end:new Date(vis.moment($scope.datetime).utcOffset($scope.timezones[i].utcoffset) + 1000 * 60 * 60) });
                    }catch(e){
                        console.log(e);
                    }
                }
            }
            $scope.realtimebutton.style = {background:'#FFFFFF'};
            $scope.widget.settings.datetime = $scope.datetime;
        }else {
            alert("Select a date and time and then set.");
        }
    };

    //Function to set timeline to realtime or mission time
    $scope.realtime = function(){
        if($scope.interval){
            $interval.cancel($scope.interval);
        }
        $scope.clock = dashboardService.getTime(0);
        timeline.setOptions({start: new Date(vis.moment($scope.clock.today).utc() - 1000 * 60 * 60),end:new Date(vis.moment($scope.clock.today).utc() + 1000 * 60 * 60) });  
        if($scope.timezones.length > 0){
            for(var i=0;i<$scope.timezones.length;i++){
                try{
                    $scope.tztimeline[i].setOptions({start: new Date(vis.moment($scope.clock.today).utcOffset($scope.timezones[i].utcoffset) - 1000 * 60 * 60),end:new Date(vis.moment($scope.clock.today).utcOffset($scope.timezones[i].utcoffset) + 1000 * 60 * 60) });
                }catch(e){
                    console.log(e);
                }
                       
            }
        }
        $scope.datetime = "";
        $scope.widget.settings.datetime = "";
        $scope.interval = $interval($scope.updateClock, 1000);
        $scope.realtimebutton = { 
            style : {
                background:'#12C700'
             }
        };
    }

    //Function to create groups with groupname as nested and other
    //Function Parameters :
       //groups = new data set to accomodate the groups
       //names = All the event names
       //grouporder = the order of the events to be displayed in the widget.
    function createEvents(groups,names,grouporder){

        if(grouporder !== undefined){
            var tempArray1 = [];
            var tempArray2 = [];

            //Check if all the events have group name other
            var grpstatus = isGroupOther(names);

            //Non nested and other events
            for(var h=0;h<names.length;h++){
                if(names[h].groupname !== "Nested" && names[h].groupname !== "Other"){
                    tempArray1.push(names[h]);
                } else{
                    tempArray2.push(names[h]);
                }
            }

            //Order your nested and other events
            for(var j=0;j<grouporder.length;j++){
                for(var k=0;k<tempArray2.length;k++){
                    if(grouporder[j].Label === tempArray2[k].ename){
                        tempArray1.push({ename:grouporder[j].Label,groupname:tempArray2[k].groupname})
                    }
                }
            }


            for(var a=0;a<tempArray1.length;a++){
                if(tempArray1[a].groupname === "Nested"){
                    groups.add({id:a,content:tempArray1[a].ename,nestedGroups:[],className:'groupheader'});
                }
                else if(tempArray1[a].groupname === "Other"){
                    if(grpstatus === true){
                        groups.add({id:a,content:tempArray1[a].ename,className:'onlyotherevents'});
                    }else {
                        groups.add({id:a,content:tempArray1[a].ename,className:'otherevent'});
                    }
                   
                }else {
                    groups.add({id:a,content:tempArray1[a].ename});
                }
            }

            for(var b=0;b<tempArray1.length;b++){
                for(var c=0;c<groups.length;c++){
                    if(tempArray1[b].groupname === groups._data[c].content){
                        groups._data[b].className = "innerItem";                 
                        groups._data[c].nestedGroups.push(b);
                    }
                }
            }


        }else {
            for(var a=0;a<names.length;a++){
                if(names[a].groupname === "Nested"){
                    groups.add({id:a,content:names[a].ename,nestedGroups:[],className:'groupheader'});
                }
                else if(names[a].groupname === "Other"){
                    groups.add({id:a,content:names[a].ename,className:'otherevent'});
                }else {
                    groups.add({id:a,content:names[a].ename});
                }
            }        
            for(var b=0;b<names.length;b++){
                for(var c=0;c<groups.length;c++){
                    if(names[b].groupname === groups._data[c].content){
                        groups._data[b].className = "innerItem";                 
                        groups._data[c].nestedGroups.push(b);
                    }
                }
            }

        }
        globalgroups = groups;
        return groups;
    }

    //Function to check if a name already exists in an array to avoid duplicates in group order display
    function contentExists(groupid,groupnames) {
        return groupnames.some(function(el) {
            return el.ename === groupid;
      }); 
    }

    //Function to create the timeline range items for each event
    //Function Parameters:
        //items = new created data set to accomodate all the timeranges of all the events
        //groups = groups created in createEvents function
        //newgroupContents = all events with event name or label and ordered by the user.
    function createEventTimeline(items,groups,newgroupContents){
        items = new vis.DataSet();
        var count = 0;
        gridService.loadTimelineEvents().then(function(response){
            $scope.timelinedata = response.data;
            for(var b=0;b<newgroupContents.length;b++){
                for(var a=0;a<$scope.timelinedata.length;a++){
                    if(newgroupContents[b].label === $scope.timelinedata[a].eventname){
                        newgroupContents[b].eventdata = $scope.timelinedata[a].eventdata;
                        newgroupContents[b].eventinfo = $scope.timelinedata[a].eventinfo;
                    }
                }
            }

            for(var k=0;k<groups.length;k++){
                for (var i = 0; i < newgroupContents.length; i++) {
                    if(groups._data[k].content === newgroupContents[i].label){
                        if(newgroupContents[i].eventdata.length > 0){
                            for(var j=0;j<newgroupContents[i].eventdata.length;j++){
                                if(newgroupContents[i].eventdata[j].start !== "" && newgroupContents[i].eventdata[j].end !== ""){
                                    //var start = vis.moment(vis.moment.utc().format(newgroupContents[i].eventdata[j].start));
                                    // var end = vis.moment(vis.moment.utc().format(newgroupContents[i].eventdata[j].end));
                                    var start = vis.moment.utc().format(newgroupContents[i].eventdata[j].start);
                                    var end = vis.moment.utc().format(newgroupContents[i].eventdata[j].end);
                                    var content = "";
                                    if(newgroupContents[i].eventdata[j].content){
                                        content = newgroupContents[i].eventdata[j].content;
                                    }
                                    
                                    if(content !== ""){
                                        items.add({
                                            id: count,
                                            content : content,
                                            className : "event",
                                            group : groups._data[k].id,
                                            start : start,
                                            end : end
                                        });
                                    }else{
                                        items.add({
                                            id: count,
                                            content : newgroupContents[i].eventinfo,
                                            className : "event",
                                            group : groups._data[k].id,
                                            start : start,
                                            end : end
                                        });
                                    }
                                    count++;
                                }else if(newgroupContents[i].eventdata[j].start !== "" && !newgroupContents[i].eventdata[j].end){
                                    //var start = vis.moment(vis.moment.utc().format(newgroupContents[i].eventdata[j].start));
                                    var start = vis.moment.utc().format(newgroupContents[i].eventdata[j].start);
                                    items.add({
                                        id: count,
                                        content : newgroupContents[i].eventinfo,
                                        className : "event",
                                        group : groups._data[k].id,
                                        start : start
                                    });
                                    count++;
                                }
                            }
                        }
                    }
                }
            }
        });
        return items;
    }

    //Function to read events and create names array categorized with groupname
    //Function parameters:
        //eventsselected = all the events selected from the settings menu.
    function buildEventProperties(eventsselected){
        var names = [];

        for(var a=0;a<eventsselected.length;a++){
            names.push({"ename":eventsselected[a].label,"groupname":eventsselected[a].group});
        }

        for (var g = 0; g < names.length; g++) {
            if(names[g].groupname === "Other" || names[g].groupname === "Nested"){

            }else {
                if(contentExists(names[g].groupname,names) === false){
                    names.push({"ename":names[g].groupname,"groupname":"Nested"}); 
                }
            }
        }
        return names;
    }

    //Function to set options for the timeline 
    //Function Parameters:
        // start : the timeline start time
        // end : the timeline end time
    function setStartAndEndForOptions(start,end){
        var options = {
            groupTemplate: function(group){
                var container = document.createElement('div');
                var label = document.createElement('span');
                if(group.nestedInGroup){
                    label.innerHTML = group.content ;
                    container.insertAdjacentElement('beforeEnd',label);
                    var outerdiv = document.createElement('div');
                    var button = document.createElement("button");
                    var arrow = document.createElement("i");
                    var innerdiv = document.createElement("div");
                    var hidep = document.createElement("p");
                    var moveupp = document.createElement("p");
                    var movedowp = document.createElement("p");
                    var hide = document.createElement("a");
                    var moveup = document.createElement("a");
                    var movedownp = document.createElement("a");
                    var movedown = document.createElement("a");


                    outerdiv.className = "dropdown";
                    outerdiv.setAttribute('style', "display:inline");
                    var button1 = outerdiv.appendChild(button);
                    button1.className = "btn btn-secondary dropdown-toggle";
                    button1.setAttribute('data-toggle', "dropdown");
                    button1.setAttribute('aria-haspopup', "true");
                    button1.setAttribute('aria-expanded', "false");
                    button1.setAttribute('style', "padding:0px;margin-right:2px;margin-bottom:3px;background:none;");
                    var arrow1 = button1.appendChild(arrow);
                    arrow1.className = "fa fa-chevron-right";
                    var innerdiv1 = outerdiv.appendChild(innerdiv);
                    innerdiv1.className = "dropdown-menu";
                    innerdiv1.setAttribute('style', "min-width:100px !important;border-radius:0px");
                    var hidep1 = innerdiv1.appendChild(hidep);
                    var hide1 = hidep1.appendChild(hide);
                    var textnodehide = document.createTextNode("Hide"); 
                    hide1.className = "dropdown-item";
                    hide1.setAttribute('style', "padding-left:10px");
                    hide1.appendChild(textnodehide); 
                    var moveupp1 = innerdiv1.appendChild(moveupp);
                    var moveup1 = moveupp1.appendChild(moveup);
                    var textnodemoveup = document.createTextNode("Move Up"); 
                    moveup1.className = "dropdown-item";
                    moveup1.setAttribute('style', "padding-left:10px");
                    moveup1.appendChild(textnodemoveup); 
                    var movedownp1 = innerdiv1.appendChild(movedownp);
                    var movedown1 = movedownp1.appendChild(movedown);
                    var textnodemovedown = document.createTextNode("Move Down"); 
                    movedown1.className = "dropdown-item";
                    movedown1.setAttribute('style', "padding-left:10px");
                    movedown1.appendChild(textnodemovedown); 


                    hide1.addEventListener('click',function(){
                        if(group.nestedInGroup){
                            globalgroups.update({id: group.id, visible: false});
                        }
                    });

                    moveup1.addEventListener('click',function(){
                        if(group.id !== 0){
                            var item1 = group.content.split("_");
                            var item2 = [];
                            var content1;
                            var content2;
                            for(var i=0;i<globalgroups.length;i++){
                                if(group.id === globalgroups._data[i].id){
                                    item2 = globalgroups._data[i-1].content.split("_");
                                    if(item1[0] === item2[0]){
                                        content1 = globalgroups._data[i].content;
                                        content2 = globalgroups._data[i-1].content;
                                        break;
                                    }
                                    else {
                                        alert("You have reached the top of the list");
                                        break;
                                    }
                                }
                            }

                            if(content1 !== undefined && content2 !== undefined){
                                globalgroups.update({id: group.id,content: content2});
                                globalgroups.update({id: group.id-1,content: content1});
                                setEvents(content1,content2);
                            }
                        }else if(group.id === 0){
                            alert("You have reached the top of the list");
                        }
                    });

                    movedown1.addEventListener('click',function(){
                        if(group.id !== globalgroups.length-1){
                            var item1 = group.content.split("_");
                            var item2 = [];
                            var content1;
                            var content2;
                            for(var i=0;i<globalgroups.length;i++){
                                if(group.id === globalgroups._data[i].id){
                                    item2 = globalgroups._data[i+1].content.split("_");
                                    if(item1[0] === item2[0]){
                                        content1 = globalgroups._data[i].content;
                                        content2 = globalgroups._data[i+1].content;
                                        break;
                                    }else {
                                        alert("You have reached the bottom of the list");
                                        break;
                                    }
                                }
                            }
                            if(content1 !== undefined && content2 !== undefined){
                                globalgroups.update({id: group.id,content: content2});
                                globalgroups.update({id: group.id+1,content: content1});
                                setEvents(content1,content2);
                            }

                        }else if(group.id === globalgroups.length-1){
                            alert("You have reached the bottom of the list");
                        }
                    });
                    container.insertAdjacentElement('afterbegin',outerdiv);
                    return container;
                }else {
                    label.innerHTML = group.content;
                    container.insertAdjacentElement('beforeEnd',label);
                    return container;
                }
            },
            groupEditable: true,
            moment: function(date) {
                return vis.moment(date).utc();
            },
            start : start,
            end : end,
            orientation: {axis: "none"}
    };
            return options;
    }

    //Function to fetch timeline options and display
    function gettimelineOptions(){
        if($scope.widget.settings.start && $scope.widget.settings.end){
            var options = setStartAndEndForOptions($scope.widget.settings.start,$scope.widget.settings.end);
            $scope.options = options;
        }else {
            var starttime = new Date(vis.moment(dashboardService.getTime(0).today).utc() - 1000 * 60 * 60 );
            var endtime = new Date(vis.moment(dashboardService.getTime(0).today).utc() + 1000 * 60 * 60 ); 
            var options = setStartAndEndForOptions(starttime,endtime);
            $scope.options = options;
        }
        return $scope.options;
    }

   //Function to set event order after using move up or down option from event group dropdown
   //Function Parameters:
        // content1 - item to be changed to content2 position
        // content2 - item to be changed to content1 position
   function setEvents(content1,content2){
        var tempindex1 = "";
        var templabel1 = "";
        var tempgroup1 = "";
        var tempeventdata1= [];
        var tempeventinfo1 = "";
        var tempindex2 = "";
        var templabel2 = "";
        var tempgroup2 = "";
        var tempeventdata2= [];
        var tempeventinfo2 = "";
        for(var k=0;k<$scope.widget.settings.events.length;k++){
            if($scope.widget.settings.events[k].label === content1){
                tempindex1 = k;
                templabel1 = content1;
                tempgroup1 = $scope.widget.settings.events[k].group;
                tempeventdata1 = $scope.widget.settings.events[k].eventdata;
                tempeventinfo1 = $scope.widget.settings.events[k].eventinfo;
            }else if($scope.widget.settings.events[k].label === content2){
                tempindex2 = k;
                templabel2 = content2;
                tempgroup2 = $scope.widget.settings.events[k].group;
                tempeventdata2 = $scope.widget.settings.events[k].eventdata;
                tempeventinfo2 = $scope.widget.settings.events[k].eventinfo;
            }
        }

        $scope.widget.settings.events[tempindex1].label = templabel2;
        $scope.widget.settings.events[tempindex1].group = tempgroup2;
        $scope.widget.settings.events[tempindex1].eventdata = tempeventdata2;
        $scope.widget.settings.events[tempindex1].eventinfo = tempeventinfo2


        $scope.widget.settings.events[tempindex2].label = templabel1;
        $scope.widget.settings.events[tempindex2].group = tempgroup1;
        $scope.widget.settings.events[tempindex2].eventdata = tempeventdata1;
        $scope.widget.settings.events[tempindex2].eventinfo = tempeventinfo1;
   }

   //Function to check if the events displayed in the timeline are group other
   // if there are all other css is different for only those events
    function isGroupOther(events){
        var isGrpOtherStatus = false;
        var allcount = 0;

        for(var i=0;i<events.length;i++){
            if(events[i].groupname === "Other"){
                allcount++;
            }
        }
        if(allcount === events.length){
            isGrpOtherStatus = true;
        }else {
            isGrpOtherStatus = false;
        }
        return isGrpOtherStatus;
   }

    $scope.$on("$destroy", 
        function(event) {
           $interval.cancel( $scope.interval );
        }
    );  
});



