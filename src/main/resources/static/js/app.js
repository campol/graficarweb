var clientModule = angular.module('clientApp', ['ngRoute', 'ui.bootstrap']);

var urlBase = "http://localhost:8080/user";
clientModule.config(function ($routeProvider) { 
	$routeProvider
    .when('/crearGrafico', {
        templateUrl: 'crearGrafico.html',
        controller: 'GraficoController'
    });
});

clientModule.controller('GraficoController', ["$scope", "$http", "$timeout", "$interval", function ($scope, $http, $timeout, $interval) {
	$scope.tipoGrafico = [{"nombre":"Barras"},{"nombre":"XY"}]
	$scope.grafico = {};

}]);