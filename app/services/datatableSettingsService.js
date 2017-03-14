app
.factory('datatableSettingsService', function() { 

	var checkedValues = {
		checkedId: true,
		checkedName: true,
		checkedAlow: true,
		checkedWlow: true,
		checkedValue: true,
		checkedWhigh: true,
		checkedAhigh: true,
		checkedUnits: true,
		checkedNotes: true
	};

	function getValues(){
		return checkedValues;
	}

	function setCheckedValues(val){
		checkedValues.checkedId = val.checkedId;
		checkedValues.checkedName = val.checkedName;
		checkedValues.checkedAlow = val.checkedAlow;
		checkedValues.checkedWlow = val.checkedWlow;
		checkedValues.checkedValue = val.checkedValue;
		checkedValues.checkedWhigh = val.checkedWhigh;
		checkedValues.checkedAhigh = val.checkedAhigh;
		checkedValues.checkedUnits = val.checkedUnits;
		checkedValues.checkedNotes = val.checkedNotes;
	}

	return {
		checkedValues:checkedValues,
		getValues:getValues,
		setCheckedValues:setCheckedValues
	}

});