app
.factory('datatableService', function() { 

	function setCheckedValues(widget,val){
		widget.settings.checkedValues.checkedId = val.checkedId;
		widget.settings.checkedValues.checkedName = val.checkedName;
		widget.settings.checkedValues.checkedAlow = val.checkedAlow;
		widget.settings.checkedValues.checkedWlow = val.checkedWlow;
		widget.settings.checkedValues.checkedValue = val.checkedValue;
		widget.settings.checkedValues.checkedWhigh = val.checkedWhigh;
		widget.settings.checkedValues.checkedAhigh = val.checkedAhigh;
		widget.settings.checkedValues.checkedUnits = val.checkedUnits;
		widget.settings.checkedValues.checkedNotes = val.checkedNotes;
	}

	return {
		setCheckedValues:setCheckedValues
	}

});