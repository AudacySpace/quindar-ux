var app = angular.module('app', 
	['gridster', 'ui.bootstrap', 'ngMaterial','ui.bootstrap.datetimepicker',
	'cgPrompt', 'hc.marked','ui.select','ngStorage','ngAria','ngAnimate','angularjs-dropdown-multiselect','as.sortable','angularScreenfull'],function($mdThemingProvider){
		var blueTheme = $mdThemingProvider.theme('blueTheme', 'default');
  		var bluePalette = $mdThemingProvider.extendPalette('blue', {
    	'500': '#07D1EA'
  		});
  		$mdThemingProvider.definePalette('bluePalette', bluePalette);
  		blueTheme.primaryPalette('bluePalette');
});

app.config(['markedProvider', function (markedProvider) {
  	markedProvider.setRenderer({
    	link: function(href, title, text) {
      		return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
    	}
  	});
}]);