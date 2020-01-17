var clientModule = angular.module('clientApp', ['ngRoute', 'ngSanitize', 'ui.select', 'ui.bootstrap']);

var urlBase = "http://localhost:8080/user";
clientModule.config(function ($routeProvider) { 
	$routeProvider
    .when('/crearOrden', {
        templateUrl: 'crearOrden.html',
        controller: 'GetClienteCtrl'
    })
    .when('/listarOrden', {
        templateUrl: 'listarOrden.html',
        controller: 'GetClienteCtrl'
    });
});
clientModule.controller('DatepickerPopupCtrl', ["$scope", function ($scope) {
	  $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function() {
	    $scope.dt = null;
	  };

	  $scope.inlineOptions = {
	    customClass: getDayClass,
	    minDate: new Date(),
	    showWeeks: true
	  };

	  $scope.dateOptions = {
	    dateDisabled: disabled,
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(),
	    startingDay: 1
	  };

	  // Disable weekend selection
	  function disabled(data) {
	    var date = data.date,
	      mode = data.mode;
	    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	  }

	  $scope.toggleMin = function() {
	    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
	    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	  };

	  $scope.toggleMin();

	  $scope.open1 = function() {
	    $scope.popup1.opened = true;
	  };

	  $scope.open2 = function() {
	    $scope.popup2.opened = true;
	  };

	  $scope.setDate = function(year, month, day) {
	    $scope.dt = new Date(year, month, day);
	  };

	  $scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
//	  $scope.altInputFormats = ['M!/d!/yyyy'];
	  $scope.altInputFormats = ['dd/MM/yyyy'];

	  $scope.popup1 = {
	    opened: false
	  };

	  $scope.popup2 = {
	    opened: false
	  };

	  var tomorrow = new Date();
	  tomorrow.setDate(tomorrow.getDate() + 1);
	  var afterTomorrow = new Date();
	  afterTomorrow.setDate(tomorrow.getDate() + 1);
	  $scope.events = [
	    {
	      date: tomorrow,
	      status: 'full'
	    },
	    {
	      date: afterTomorrow,
	      status: 'partially'
	    }
	  ];

	  function getDayClass(data) {
	    var date = data.date,
	      mode = data.mode;
	    if (mode === 'day') {
	      var dayToCheck = new Date(date).setHours(0,0,0,0);

	      for (var i = 0; i < $scope.events.length; i++) {
	        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	        if (dayToCheck === currentDay) {
	          return $scope.events[i].status;
	        }
	      }
	    }

	    return '';
	  }
	}]);

clientModule.controller('GetClienteCtrl', ["$scope", "$http", "$timeout", "$interval", "clientFactory", function ($scope, $http, $timeout, $interval, clientFactory) {
	$scope.person = {};
	$scope.disabled = undefined;
	  $scope.searchEnabled = undefined;

	  $scope.setInputFocus = function (){
	    $scope.$broadcast('UiSelectDemo1');
	  };

	  $scope.enable = function() {
	    $scope.disabled = false;
	  };

	  $scope.disable = function() {
	    $scope.disabled = true;
	  };

	  $scope.enableSearch = function() {
	    $scope.searchEnabled = true;
	  };

	  $scope.disableSearch = function() {
	    $scope.searchEnabled = false;
	  };

	  $scope.clear = function() {
	    $scope.person.selected = undefined;
	  };

	  $scope.someGroupFn = function (item){

	    if (item.nombre[0] >= 'A' && item.nombre[0] <= 'M')
	        return 'From A - M';

	    if (item.nombre[0] >= 'N' && item.nombre[0] <= 'Z')
	        return 'From N - Z';

	  };

	  $scope.firstLetterGroupFn = function (item){
	      return item.nombre[0];
	  };

	  $scope.reverseOrderFilterFn = function(groups) {
	    return groups.reverse();
	  };
	  
	  $timeout(function(){
		  var cliente = clientFactory.getClientes();
		  cliente.then(function successCallback(response) {
				$scope.clients =  response.data;
			  	console.log($scope.clients);
			  }, function errorCallback() {
				  alert("Error. No se pudo obtener la lista de clientes");
			  });
		  },500);
}]);

clientModule.factory("clientFactory", ["$http", function ($http) {
    var dataFactory = {};
    dataFactory.getClientes = function () {
        var url = urlBase + "/clientes";
        return $http({
            method: 'GET',
            url: url,
            data: {},
            responseType: "json"
            });
    };
    return dataFactory;
}]);

clientModule.controller('OrdenCompraController', ["$scope", "ordenCompraFactory" , function ($scope, ordenCompraFactory) {
	$scope.ordenC= {};
	$scope.ordenC.dt = new Date();	
	$scope.getOrdensMes = function (cliente) {
		$scope.cliente = cliente;
		var fec = new Date();
		var primerDia = new Date(fec.getFullYear(), fec.getMonth(), 1);
		$scope.ordenC.fechaDesde = primerDia;
		var ultimoDia = new Date(fec.getFullYear(), fec.getMonth() + 1, 0);
		$scope.ordenC.fechaHasta = ultimoDia;
		$scope.buscarOrdenes();
	};
	$scope.getProductosDisp = function (cliente) {
		$scope.cliente = cliente;
		var productos = ordenCompraFactory.getProductosDisp(cliente.id);
		productos.then(function successCallback(response) {
				$scope.listproductos =  response.data;
			  	console.log($scope.listproductos);
			  }, function errorCallback() {
				  alert("Error. No se pudo obtener la lista de clientes");
			  });
	};
	
	$scope.addProducts = function (){
		console.log($scope.selectedProdct);
		if($scope.selectedProdct == undefined){
			alert("Seleccione un producto");
			return;
		} 
		$scope.listItems = [];
		for (var index in $scope.selectedProdct) {
			var ordenDetalle = {cantidad: 1, idProducto: $scope.selectedProdct[index].id, descripcionProd: $scope.selectedProdct[index].descripcion, precio: $scope.selectedProdct[index].precio};
			$scope.listItems.push(ordenDetalle)
		}
		console.log($scope.listItems);
	};
	
	$scope.enabledEdit =[];
	$scope.editOrden = function(index){
		console.log("edit index"+index);
		$scope.enabledEdit[index] = true;
	};
	$scope.deleteOrden = function(index) {
		$scope.listItems.splice(index,1);
	};
	
	$scope.crearOrden = function(){
		$scope.orden = {idCliente: $scope.cliente.id, fecha: $scope.ordenC.dt, dirEntrega: $scope.ordenC.direccionEntrga,
				detallesOrden: $scope.listItems};
		console.log("form submitted:"+angular.toJson($scope.orden ));
		var crearOrden = ordenCompraFactory.crearOrden(angular.toJson($scope.orden));
		crearOrden.then(function successCallback(response) {
				alert("Orden creada satisfactoriamente");
			  }, function errorCallback() {
				  alert("Error. No se pudo crear la orden");
			  });
		
	};
	
	$scope.buscarOrdenes = function () {
		console.log("fecha");
		var fechaDes = new Date($scope.ordenC.fechaDesde);
		var fechaDesF = fechaDes.getDate() + '/' + (fechaDes.getMonth()+1) + '/' +  fechaDes.getFullYear();
		var fechaHasta = new Date($scope.ordenC.fechaHasta);
		var fechaHastaF = fechaHasta.getDate() + '/' + (fechaHasta.getMonth()+1) + '/' +  fechaHasta.getFullYear();
		
		var buscarOrdenes = ordenCompraFactory.getOrdenesCompra($scope.cliente.id, fechaDesF, fechaHastaF);
		buscarOrdenes.then(function successCallback(response) {
				var ordenes = response.data;
				console.log("Ordenes obtenidas");
				console.log(ordenes)
				$scope.listOrdenes = [];
				for(index in ordenes){
					var total = 0;
					var descProdt = "";
					for( j in ordenes[index].detallesOrden){
						total = total + (ordenes[index].detallesOrden[j].cantidad * ordenes[index].detallesOrden[j].precio);
						descProdt = descProdt + ordenes[index].detallesOrden[j].cantidad +" x "+ordenes[index].detallesOrden[j].descripcionProd + ", "; 
					}
					var dateC = new Date(ordenes[index].fecha);
					var orden = {fechaCreacion: dateC.toLocaleString(), idOrden: ordenes[index].id,
							dirEntrega: ordenes[index].dirEntrega, totalP: total, productos: descProdt};
					$scope.listOrdenes.push(orden);
				}
				console.log("Ordenes obtenidas");
			  }, function errorCallback() {
				  alert("Error. No se pudo obtener las ordenes");
			  });
	};
}]);

clientModule.factory("ordenCompraFactory", ["$http", function ($http) {
    var dataFactory = {};
    dataFactory.getProductosDisp = function (idCliente) {
        var url = urlBase + "/productosDisponibles?idCliente="+idCliente;
        return $http({
            method: 'GET',
            url: url,
            data: {},
            responseType: "json"
            });
    };
    
    dataFactory.getOrdenesCompra = function (idCliente, fechaDesde, fechaHasta) {
        var url = urlBase + "/ordenesPorCliente?idCliente="+idCliente+"&fechaDesde="+fechaDesde+"&fechaHasta="+fechaHasta;
        return $http({
            method: 'GET',
            url: url,
            data: {},
            responseType: "json"
            });
    };
    
    dataFactory.crearOrden = function (orden){
    	var url = urlBase + "/crearOrdn";
    	return $http({
            method: 'POST',
            url: url,
            data: orden,
            headers: {
                'Accept': 'application/json'
            }});
    };
    return dataFactory;
}]);