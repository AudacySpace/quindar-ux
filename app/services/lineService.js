app
.factory('lineService', function() { 

	var param = [];
	var mainId;
	var settingsId;
	var idStore = [];
	
	setParam = function(main,settings,name,id){
		this.param.push({main, settings, name, id});
	}
	
	getParam = function(){
		return param
	}
	
	setIdStore = function(main, settings){
		this.idStore.push({main, settings});
	}
	
	getIdStore = function(){
		return idStore
	}
	return {
		param,
		mainId,
		settingsId,
		idStore,
		setParam,
		getParam,
		setIdStore,
		getIdStore
	}

});