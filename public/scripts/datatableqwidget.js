/*Data Table*/

var timerArray = [];
  function addDataTable(){
    QUINDAR.dcount++;
    var tableLayout = '<div id="outer-DTwidget-div'+QUINDAR.dcount+'">'
                        +'<div class="panel panel-primary grid-stack-item-content dataTableQwidget" style="margin-bottom:0;" id="dataTableQwidget'+QUINDAR.dcount+'">'
                        +'<div class="panel-heading">'
                          +'<button type="button" class="glyphicon glyphicon-th pull-left settings-th">'
                          +'</button>'
                          +'<h5 class="datatable-title">Data Table</h5>'
                          +'<button type="button" class="glyphicon glyphicon-cog pull-right settings" onclick="openDataTableSettings('+QUINDAR.dcount+')">'
                          +'</button>'
                          +'<button type="button" class="glyphicon glyphicon-download-alt pull-right save-data-table">'
                          +'</button>'
                          +'<button type="button" class="glyphicon glyphicon-trash pull-right delete-data-table" onclick="openDeleteTableOptions('+QUINDAR.dcount+')">'
                          +'</button>'
                        +'</div>'
                        +'<div style="overflow:auto;height:90%" id="data-tables'+QUINDAR.dcount+'">'
                        +'<table class="table table-bordered table-responsive col-md-12 table-condensed cf" id="dataTable'+QUINDAR.dcount+'">'
                          +'<thead id="telehead" class="datatableheader">'
                            +'<tr>'
                              +'<th id="category" style="width:5%"></th>'
                              +'<th id="id" style="text-align:left;width:10%" class="id">ID</th>'
                              +'<th id="name" style="text-align:left;width:15%;" class="name">NAME</th>'
                              +'<th id="alarm_low" style="text-align:center;width:2%" class="alarm_low numeric"><img src="../icons/data_table_cat_ALARMLOW.svg" class="img_alow"/></th>'
                              +'<th id="warn_low" style="text-align:center;width:2%" class="warn_low numerice"><img src="../icons/data_table_cat_WARNLOW.svg" class="img_alow"/></th>'
                              +'<th id="value" style="text-align:center;width:2%" class="value numeric"><img src="../icons/data_table_cat_VALUE.svg" class="img_alow"/></th>'
                              +'<th id="warn_high" style="text-align:center;width:2%" class="warn_high numeric"><img src="../icons/data_table_cat_WARNHIGH.svg" class="img_alow"/></th>'
                              +'<th id="alarm_high" style="text-align:center;width:2%" class="alarm_high numeric"><img src="../icons/data_table_cat_ALARMHIGH.svg" class="img_alow"/></th>'
                              +'<th id="units" style="text-align:left;width:5%" class="units">UNITS</th>'
                              +'<th id="notes" style="text-align:left" class="notes">NOTES</th>'
                            +'</tr>'
                          +'</thead>'
                          +'<tbody>'
          								  +'<tr id="'+QUINDAR.rcount+'">'
            								  +'<td class="categoryID-arrow" id="categoryID-arrow'+QUINDAR.rcount+'">'
                                +'<div class="btn-group selectmenu">'
  												        +'<a href="#" style="width:100%" class="btn btn-default arrowbtn" data-toggle="dropdown">'
    												        +'<span class="glyphicon glyphicon-menu-right side-arrow" id="side-arrow"></span>'
    												        +'<span class="sr-only">Toggle Dropdown</span>'
  												        +'</a>'
  												        +'<ul class="dropdown-menu drpmenu" role="menu" id="drpmenu">'
    												        +'<li class="uldrpmenu"><a href="#" class="cat-id" id="catid'+QUINDAR.rcount+'" onclick="getTdata('+QUINDAR.rcount+');">Select Category ID</a></li>'
                                    +'<li class="divider liner"></li>'
    												        +'<li><a href="#" class="row-above">Add Row Above</a></li>'
    												        +'<li><a href="#" class="row-below">Add Row Below</a></li>'
    												        +'<li><a href="#" class="move-up">Move Row Up</a></li>'
    												        +'<li><a href="#" class="move-down">Move Row Down</a></li>'
    												        +'<li><a href="#" class="delete-row">Delete Row</a></li>'
                                    +'<li><a href="#" class="make-header">Convert to Header</a></li>'
    											        +'</ul>'
    										        +'</div>'
                              +'</td>'
            								  +'<td style="text-align:left" id="id'+QUINDAR.rcount+'" class="id" data-title="ID"></td>'
            								  +'<td style="text-align:left;" class="name" data-title="NAME"><span class="namestyle" id="name'+QUINDAR.rcount+'"></span></td>'
            								  +'<td style="text-align:right" id="alarm_low'+QUINDAR.rcount+'" class="alarm_low numeric" data-title="ALARM_LOW"></td>'
            								  +'<td style="text-align:right" id="warn_low'+QUINDAR.rcount+'" class="warn_low numeric" data-title="WARN_LOW"></td>'
            								  +'<td style="text-align:right" id="value'+QUINDAR.rcount+'" class="value numeric" data-title="VALUE"></td>'
            								  +'<td style="text-align:right" id="warn_high'+QUINDAR.rcount+'" class="warn_high numeric" data-title="WARN_HIGH"></td>'
            								  +'<td style="text-align:right" id="alarm_high'+QUINDAR.rcount+'" class="alarm_high numeric" data-title="ALARM_HIGH"></td>'
            								  +'<td style="text-align:left" id="units'+QUINDAR.rcount+'" class="units" data-title="UNITS"></td>'
            								  +'<td style="text-align:left" id="notes'+QUINDAR.rcount+'" class="notes" data-title="NOTES"></td>'
            							  +'</tr>'
									        +'</tbody>'
                        +'</table>'
                        +'</div>'
                        +'<div class="checkbox-form row datatablesettings" style="display:none" id="data-table-settings-menu'+QUINDAR.dcount+'">'
                          +'<div class="col-md-1"></div>'
                          +'<div class="col-md-10 categorydrpdown">'
                            +'<h4>Category Display</h4>'
                            +'<div class="dropdown">'
                              +'<button type="button" name="lpbtn'+QUINDAR.dcount+'" class="btn dropdown-toggle cdrpdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                +'<span class="pull-left categoryname">Category</span> <span class="caret pull-right caretcategory"></span>'
                              +'</button>'
                              +'<ul class="dropdown-menu dtdropdown" name="lpdropdown'+QUINDAR.dcount+'">'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="id" checked="checked">Id</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="name" checked="checked">Name</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="alarm_low" checked="checked">Alarm Low</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="warn_low" checked="checked">Warn Low</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="value" checked="checked">Value</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="warn_high" checked="checked">Warn High</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="alarm_high" checked="checked">Alarm High</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="units" checked="checked">Units</label></li>'
                                +'<li class="checkbox dtcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="" name="notes" checked="checked">Notes</label></li>'
                              +'</ul>'
                            +'</div>'
                            +'<hr class="hline"/>'
                            +'<button type="submit" class="btn btn-default btn-info dtbtns" onclick="saveCategory('+QUINDAR.dcount+')">SAVE</button>'
                            +'<button type="button" class="btn btn-default btn-info dtbtns" onclick="closeCategory('+QUINDAR.dcount+')">CLOSE</button>'
                          +'</div>'
                          +'<div class="col-md-1"></div>'
                        +'</div>'
                        +'<div class="checkbox-form row deldatatable" style="display:none" id="del-data-table-options'+QUINDAR.dcount+'">'
                          +'<div class="col-md-1"></div>'
                          +'<div class="col-md-10 categorydrpdown">'
                            +'<h4>Delete Widget?</h4>'
                            +'<hr class="hline"/>'
                            +'<button type="submit" class="btn btn-default btn-info dtbtns" onclick="deleteDataTable('+QUINDAR.dcount+')">YES</button>'
                            +'<button type="button" class="btn btn-default btn-info dtbtns" onclick="closeDelDataTableOptions('+QUINDAR.dcount+')">NO</button>'
                          +'</div>'
                          +'<div class="col-md-1"></div>'
                        +'</div>'
                      +'</div>'
                    +'</div>';
    QUINDAR.grid.addWidget($(tableLayout),0,0,10,4);
  };

  /* Event Listener to Add Row above the current row*/
  $(document).on('click', '.row-above', function(e) {
    QUINDAR.rcount++;
    var tr_referred = e.target.closest("tr");
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');

    td0.className = "categoryID-arrow";
    td0.id = "categoryID-arrow"+QUINDAR.rcount;
    td1.id ="id"+QUINDAR.rcount;
    td2.id ="name"+QUINDAR.rcount;
    td3.id ="alarm_low"+QUINDAR.rcount;
    td4.id ="warn_low"+QUINDAR.rcount;
    td5.id ="value"+QUINDAR.rcount;
    td6.id="warn_high"+QUINDAR.rcount;
    td7.id="alarm_high"+QUINDAR.rcount;
    td8.id="units"+QUINDAR.rcount;
    td9.id="notes"+QUINDAR.rcount;
    tr.id = QUINDAR.rcount;
    td0.innerHTML = '<div class="btn-group selectmenu">'
                      +'<a href="#" style="width:100%" class="btn btn-default arrowbtn" data-toggle="dropdown">'
                        +'<span class="glyphicon glyphicon-menu-right side-arrow" id="side-arrow"></span>'
                        +'<span class="sr-only">Toggle Dropdown</span>'
                      +'</a>'
                      +'<ul class="dropdown-menu drpmenu" role="menu" id="drpmenu">'
                        +'<li class="uldrpmenu"><a href="#" class="cat-id" id="catid'+QUINDAR.rcount+'" onclick="getTdata('+QUINDAR.rcount+');">Select Category ID</a></li>'
                        +'<li><a href="#" class="row-above">Add Row Above</a></li>'
                        +'<li><a href="#" class="row-below">Add Row Below</a></li>'
                        +'<li><a href="#" class="move-up">Move Row Up</a></li>'
                        +'<li><a href="#" class="move-down">Move Row Down</a></li>'
                        +'<li><a href="#" class="delete-row">Delete Row</a></li>'
                        +'<li><a href="#" class="make-header">Convert to Header</a></li>'
                      +'</ul>'
                    +'</div>';

    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tr_referred.parentNode.insertBefore(tr, tr_referred);
  });

/* Event Listener to Add Row below the current row*/
  $(document).on('click', '.row-below', function(e) {
    QUINDAR.rcount++;
    var tr_referred = e.target.closest("tr");
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');

    td0.className = "categoryID-arrow";
    tr.id = QUINDAR.rcount;
    td0.innerHTML = '<div class="btn-group selectmenu">'
                      +'<a href="#" style="width:100%" class="btn btn-default arrowbtn" data-toggle="dropdown">'
                        +'<span class="glyphicon glyphicon-menu-right side-arrow" id="side-arrow"></span>'
                        +'<span class="sr-only">Toggle Dropdown</span>'
                      +'</a>'
                      +'<ul class="dropdown-menu drpmenu" role="menu" id="drpmenu">'
                        +'<li class="uldrpmenu"><a href="#" class="cat-id" id="catid'+QUINDAR.rcount+'" onclick="getTdata('+QUINDAR.rcount+');">Select Category ID</a></li>'
                        +'<li><a href="#" class="row-above">Add Row Above</a></li>'
                        +'<li><a href="#" class="row-below">Add Row Below</a></li>'
                        +'<li><a href="#" class="move-up">Move Row Up</a></li>'
                        +'<li><a href="#" class="move-down">Move Row Down</a></li>'
                        +'<li><a href="#" class="delete-row">Delete Row</a></li>'
                        +'<li><a href="#" class="make-header">Convert to Header</a></li>'
                      +'</ul>'
                    +'</div>';
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tr_referred.parentNode.insertBefore(tr, tr_referred.nextSibling);
  });

  /* Event Listener to Make current row into a header row*/
  $(document).on('click', '.make-header', function(e) {
    var tr_referred = e.target.closest("tr");
    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var td8 = document.createElement('td');
    var td9 = document.createElement('td');

    td0.className = "categoryID-arrow header-row";
    td0.innerHTML = '<div class="btn-group selectmenu">'
                      +'<a href="#" style="width:100%" class="btn btn-default arrowbtn" data-toggle="dropdown">'
                        +'<span class="glyphicon glyphicon-menu-right side-arrow" id="side-arrow"></span>'
                        +'<span class="sr-only">Toggle Dropdown</span>'
                      +'</a>'
                      +'<ul class="dropdown-menu drpmenu" role="menu" id="drpmenu">'
                        +'<li class="uldrpmenu"><a href="#" id="catid'+QUINDAR.rcount+'" onclick="getTdata('+QUINDAR.rcount+');">Select Category ID</a></li>'
                        +'<li><a href="#" class="row-above">Add Row Above</a></li>'
                        +'<li><a href="#" class="row-below">Add Row Below</a></li>'
                        +'<li><a href="#" class="move-up">Move Row Up</a></li>'
                        +'<li><a href="#" class="move-down">Move Row Down</a></li>'
                        +'<li><a href="#" class="delete-row">Delete Row</a></li>'
                        +'<li><a href="#" class="make-header">Convert to Header</a></li>'
                      +'</ul>'
                    +'</div>';
    td1.className = "header-row"
    td1.colSpan = "9";
    td1.innerHTML = '<span class="header-span">Click to add title</span><input type="text" id="text-title" name="text" value="" placeholder="Click anywhere to save" style="color:#000000;"'
    +'class="toedit" readonly="readonly" />'
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr_referred.parentNode.insertBefore(tr, tr_referred);
    tr_referred.remove();
  });

  /* Event Listener to Delete current row*/
  $(document).on('click', '.delete-row', function(e) {
    e.target.closest("tr").remove();
  });

  /* Event Listener to Move current row above */
  $(document).on('click', '.move-up', function () {
    var thisRow = $(this).closest('tr');
    var prevRow = thisRow.prev();
    if (prevRow.length) {
        prevRow.before(thisRow);
    }
  });

  /* Event Listener to Move current row below */
  $(document).on('click', '.move-down', function () {
    var thisRow = $(this).closest('tr');
    var nextRow = thisRow.next();
    if (nextRow.length) {
        nextRow.after(thisRow);
    }
  });

  /*Event Listener to create input field to type name of the header */
  $(document).on("focus", "input#text-title", function(){
    $(this)
    .prop("readonly", false)
    .removeClass("toedit");
  });

  /*Event Listener to save typed input field value to the header */
  $(document).on("blur", "input#text-title", function(){
    $(this)
    .prop("readonly", true)
    .addClass("toedit")
    .siblings("span").text($(this).val());
  });

  /*Event Listener to create focus on the input field on hit on header row*/
  $(document).on("click", ".header-row", function(){
    $(this).children().focus();
  });

  /*Function to Save Category checkbox options*/
  function saveCategory(x){
    var list = document.getElementById("data-table-settings-menu"+x);
    var table = document.getElementById("data-tables"+x);

    $("input:checkbox:not(:checked)").each(function() {
      var column = "table ."+$(this).attr("name");
      $(column).hide();
    });

    $("input:checkbox").click(function(){
      var column = "table ."+$(this).attr("name");
      $(column).toggle();
    });

    if(list.style.display === "block"){
         list.style.display = "none"; 
         table.style.display = "block";
    }
    else{
      list.style.display = "block"; 
      table.style.display = "none";
    }    
  }

/*Function to Close Category Display Settings menu*/
  function closeCategory(x){
    var sMenu = document.getElementById("data-table-settings-menu"+x);
    var dMenu = document.getElementById("del-data-table-options"+x);
    var table = document.getElementById("data-tables"+x);
    
    sMenu.style.display = "none";
    table.style.display = "block";
    dMenu.style.display = "none";
  }

  /*Function to Delete Data Table Widget*/
  function deleteDataTable(x){
    var widget = document.getElementById("outer-DTwidget-div"+x);
    widget.remove();
  }

  /*Function to Close Delete Data Table Options*/
  function closeDelDataTableOptions(x){
    var sMenu = document.getElementById("data-table-settings-menu"+x);
    var dMenu = document.getElementById("del-data-table-options"+x);
    var table = document.getElementById("data-tables"+x);
    
    sMenu.style.display = "none";
    table.style.display = "block";
    dMenu.style.display = "none";
  }


  /*Function to get Telemetry Data from Data Menu*/
  function getTdata(rowId){
    openTelemetryNav();
    $(document).on('click','.velocity-list-item',function(elem){
      Tdata(elem,rowId);
    });   
  }

  function Tdata(elem,rowId){
    var categoryidInterval;

    for(var i=0;i<=timerArray.length;i++){
      clearInterval(timerArray[i]);
    }
    categoryidInterval = setInterval(function(){
      dataX = QUINDAR.telemetry.Audacy1[elem.target.innerHTML];
      try {
        document.getElementById("id"+rowId).innerHTML = elem.target.innerHTML;
        document.getElementById("name"+rowId).innerHTML = dataX.name;
        document.getElementById("alarm_low"+rowId).innerHTML = dataX.alarm_low;
        document.getElementById("warn_low"+rowId).innerHTML = dataX.warn_low;

        if(typeof dataX.value === "number"){
          document.getElementById("value"+rowId).innerHTML = Math.round(dataX.value * 10000)/10000;
        }else{
          document.getElementById("value"+rowId).innerHTML = dataX.value;
        }
        document.getElementById("warn_high"+rowId).innerHTML = dataX.warn_high;
        document.getElementById("alarm_high"+rowId).innerHTML = dataX.alarm_high;
        document.getElementById("units"+rowId).innerHTML = dataX.units;
        document.getElementById("notes"+rowId).innerHTML = dataX.notes;
      }catch(e){}
    }, 1000);
    timerArray[rowId] = categoryidInterval;
  }


  /*Function to Open Data Table Settings Menu*/
  function openDataTableSettings(x){
    var sMenu = document.getElementById("data-table-settings-menu"+x);
    var dMenu = document.getElementById("del-data-table-options"+x);
    var table = document.getElementById("data-tables"+x);

    if(sMenu.style.display === "none"){
      table.style.display = "none";
      sMenu.style.display = "block";
      dMenu.style.display = "none";
    }
    else{
     sMenu.style.display = "none";
     table.style.display = "block";
     dMenu.style.display = "none";
    }
  }

  /*Function to Open Delete Data Table Options*/
  function openDeleteTableOptions(x){
    var sMenu = document.getElementById("data-table-settings-menu"+x);
    var dMenu = document.getElementById("del-data-table-options"+x);
    var table = document.getElementById("data-tables"+x);

    if(dMenu.style.display === "none"){
      table.style.display = "none";
      dMenu.style.display = "block";
      sMenu.style.display = "none";
    }
    else{
     dMenu.style.display = "none";
     table.style.display = "block";
     sMenu.style.display = "none";
    }
  }






   