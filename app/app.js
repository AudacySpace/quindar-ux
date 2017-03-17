var app = angular.module('app', ['gridster', 'ui.bootstrap', 'ngMaterial', 'ui.bootstrap.datetimepicker','cgPrompt', 'angularModalService', 'hc.marked']);

app.config(['markedProvider', function (markedProvider) {
  markedProvider.setRenderer({
    link: function(href, title, text) {
      return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
    }
  });
}]);