'use strict';

angular.module('myapp', ['myapp.directives', 'ui', 'myapp.services']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  	// Url, view, ctrl
    $routeProvider.when('/', {templateUrl: 'partials/home', controller: HomeCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
}]);