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
	
	 $scope.data = [];
	 $scope.mostrarGrafica = false;

	$scope.datEjes = angular.copy( $scope.data);
	$scope.typeInput = "text";
	
	$scope.onChange = function(){
		$("#myfirstchart").empty();
		$scope.datEjes = [];
		if($scope.grafico.selectedGraf.nombre == 'XY'){
			$scope.typeInput = "number";
		} else {
			$scope.typeInput = "text";
		}	
		console.log($scope.typeInput)
	}
	$scope.addXY = function(){
		var eje ={ x:"",y:""};
		$scope.datEjes.push(eje);
	}
	$scope.deleteEje = function(index) {
		$scope.datEjes.splice(index,1);
	}
	
	$scope.crearGrafica = function(){
		$scope.mostrarGrafica = true;
		$("#myfirstchart").empty();
		console.log($scope.datEjes);
		if($scope.grafico.selectedGraf.nombre == 'XY'){
			new Morris.Line({
				  // ID of the element in which to draw the chart.
				  element: 'myfirstchart',
				  // Chart data records -- each entry in this array corresponds to a point on
				  // the chart.
				  data: $scope.datEjes,
				  hoverCallback: function(index, options, content) {
				        return(content);
				    },
				  // The name of the data record attribute that contains x-values.
				  xkey: 'x',
				  // A list of names of data record attributes that contain y-values.
				  ykeys: ['y'],
				  // Labels for the ykeys -- will be displayed when you hover over the
				  // chart.
				  labels: ['Y'],
				  parseTime: false
				});
		} else if($scope.grafico.selectedGraf.nombre == 'Barras'){
			new Morris.Bar({
				element : 'myfirstchart',
				data : $scope.datEjes,
				hoverCallback: function(index, options, content) {
			        return(content);
			    },
				xkey : 'x',
				ykeys : ['y'],
				labels : [ 'y' ],
				hideHover : 'auto',
				resize : true,
				xLabelAngle: 45,
		        gridTextSize:15
			});
		}
	}
}]);