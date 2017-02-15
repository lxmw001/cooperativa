angular.module('coop',['ui.router', 'firebase'])
.run(function($state) {

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
          url: '/',
          templateUrl: 'templates/home.html',
          controller: 'crtlHome'
      })

    .state('servicios', {
          url: '/servicios',
          templateUrl: 'templates/servicios.html',
          controller: 'crtlServicios as vm'
      })

     /*Rutas para Cuentas*/
     .state('ahorros', {
          url: '/ahorros',
          templateUrl: 'templates/cuentas/ahorros.html',
          controller: 'crtlCuentas'
      })

     /*Rutas para Depositos*/
     .state('plazo_fijo', {
          url: '/plazo_fijo',
          templateUrl: 'templates/depositos/plazo_fijo.html',
          controller: 'crtlDepositos'
      })

     .state('creditos', {
          url: '/creditos',
          templateUrl: 'templates/creditos/creditos.html',
          controller: 'crtlCreditos'
      })

     .state('micro_creditos', {
          url: '/micro_creditos',
          templateUrl: 'templates/creditos/micro_creditos.html',
          controller: 'crtlMicro'
      })

     .state('quienes_somos', {
          url: '/quienes_somos',
          templateUrl: 'templates/quienes_somos.html',
          controller: 'crtlQuienesSomos'
      })

     .state('socios', {
          url: '/socios',
          templateUrl: 'templates/socios.html',
          controller: 'crtlSocios'
      })

     .state('comunidad', {
          url: '/comunidad',
          templateUrl: 'templates/comunidad.html',
          controller: 'crtlComunidad'
      })

     .state('contactanos', {
          url: '/contactanos',
          templateUrl: 'templates/contactanos.html',
          controller: 'crtlContactanos'
      })

     .state('simulador', {
          url: '/simulador',
          templateUrl: 'templates/simulador.html',
          controller: 'crtlSimulador'
      })


  $urlRouterProvider.otherwise('/');

})

.controller('crtlHome', function($scope, $rootScope, $state,  $anchorScroll) {
  $anchorScroll();
  $rootScope.state = 'home';
  $rootScope.visible = 'ocultar';

  $scope.goAhorros = function() {
    $state.go('servicios');
  }

  $scope.goCreditos = function() {
    $state.go('servicios');
    $rootScope.typeService = 'creditos';
    $rootScope.subTypeService = 'consumo';
  }

  $scope.goInversiones = function() {
    $state.go('servicios');
    $rootScope.typeService = 'inversiones';
    $rootScope.subTypeService = 'consumo';
  }
})

.controller('crtlServicios', function($rootScope,  $anchorScroll) {
  $anchorScroll();
  $rootScope.state = 'servicios';
  $rootScope.namePage = 'Nuestros Servicios';
  $rootScope.colorBanner = 'azul';
  var vm = this;

  vm.defaultService = function() {
    vm.typeService = $rootScope.typeService || 'ahorros';
    vm.service = $rootScope.subTypeService || 'vista';
    vm.templateService = 'templates/' + vm.typeService + '/' + vm.service + '.html';
    $rootScope.typeService = '';
    $rootScope.subTypeService = '';
  }


  vm.showService = function(typeService, subTypeService) {
    vm.templateService = 'templates/' + typeService + '/' + subTypeService + '.html';
    vm.typeService = typeService;
    vm.service = subTypeService;
  }
})

.controller('crtlQuienesSomos', function($rootScope, $anchorScroll) {
  $anchorScroll();
  $rootScope.state = 'somos';
  $rootScope.namePage = 'Quienes Somos';
  $rootScope.colorBanner = 'rojo';
  $rootScope.visible = 'ocultar';
})

.controller('crtlSocios', function($rootScope, $anchorScroll) {
  $anchorScroll();
  $rootScope.state = 'socios';
  $rootScope.namePage = 'Nuestros Socios';
  $rootScope.colorBanner = 'morado';
  $rootScope.visible = 'ocultar';
})

.controller('crtlComunidad', function($scope, $rootScope, $anchorScroll) {
  $anchorScroll();
  $rootScope.state = 'comunidad';
  $rootScope.namePage = 'Coopartamos en la comunidad';
  $rootScope.colorBanner = 'verde';
  $rootScope.visible = 'mostrar';
  var vm = this;

})

.controller('crtlContactanos', function($scope, $rootScope, $anchorScroll) {
  $anchorScroll();
  $rootScope.state = 'contactanos';
  $rootScope.namePage = 'Contáctanos';
  $rootScope.colorBanner = 'cafe';
})

.controller('crtlContador', function($scope, $firebase, $anchorScroll) {
  $anchorScroll();

  contador = function(opcion) {
    $.ajax({
       url: "php/visitas.php",
       type: "post",
       data: "opcion="+opcion,
       success: function(data){
          var response = data.split(" ");
          $scope.hoy = response[2];
          $scope.mes = response[3];
          $scope.total = response[4];
       }
    });
  }

  guardar_cookie = function() {
    var date = new Date();
    var minutes = 240;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie("contador", "visitas", { expires: date });
  }

  $scope.verificar_cookie = function() {
    var visitado = $.cookie("contador");
    if(visitado) {
      contador(0);
    } else {
      contador(1);
      guardar_cookie();
    }
  }
})

.controller('crtlSuscripcion', function($scope, $firebase) {

  var clientFB;

  $scope.suscribir = function() {
    var path = 'https://coopartamos-4616a.firebaseio.com/suscriptores/' + encodeMail($scope.email);
    clientFB = new Firebase(path);
    console.log('suscribir');
    if( !$scope.nombre && !$scope.apellido &&
     !$scope.email && !$scope.telefono && !$scope.comentario) {
      mostrarMensaje('Llenar todos los campos');
      return;
    }
    var suscriptor = {
      nombre : $scope.nombre,
      apellido : $scope.apellido,
      email : $scope.email,
      telefono : $scope.telefono,
      comentario : $scope.comentario
    }

    verificarSuscriptor(function() {
      clientFB.update(suscriptor);
      mostrarMensaje('Suscrito correctamente');
      limpiarDatosSuscripcion();
      obtenerSuscriptores();
    });
  }

  encodeMail = function(email) {
    var encoded = email.split('.').join('@punto@');
    encoded = encoded.split('#').join('@num@');
    encoded = encoded.split('$').join('@money@');
    encoded = encoded.split('[').join('@corcha@');
    encoded = encoded.split(']').join('@corchc@');
    console.log(encoded);
    return encoded;
  }

  decodeMail = function(email) {
    return email.replace('@punto@', '.')
      .replace('@num@', '#')
      .replace('@money@', '$')
      .replace('@corcha@', '[')
      .replace('@corchc@', ']');
  }

  verificarSuscriptor = function(callback) {
    console.log('verificando suscriptor');
    clientFB.once('value', function(snapshot) {
      if (!snapshot.val()) {
        callback();
      } else {
        mostrarMensaje('EL correo ya esta registrado');
      }
    }, function (err) {
      console.log(err);
    });
  }

  $scope.cerrarModal = function() {
    console.log('cerrarModal');
    $('#modal1').closeModal();
  }

  limpiarDatosSuscripcion = function() {
    console.log('limpiando datos');
    $scope.$apply(function() {
      $scope.nombre = '';
      $scope.apellido = '';
      $scope.email = '';
      $scope.telefono = '';
      $scope.comentario = '';
    });
  }

  mostrarMensaje = function(mensaje) {
    console.log('mostrar Mensaje');
    Materialize.toast(mensaje, 3000, 'rounded') // 'rounded' is the class I'm applying to the toast
  }

  obtenerSuscriptores = function() {
    var path = 'https://coopartamos-4616a.firebaseio.com/suscriptores';
    clientFB = new Firebase(path);
    clientFB.once('value', function(snapshot) {
      if (snapshot.val()) {
        var suscriptores = [];
        // enviar por correo estos datos o lo q el cliente quiere hacer
        console.log(snapshot.val());
        for (suscriptor in  snapshot.val()) {
          console.log(suscriptor);
          console.log(snapshot.val()[suscriptor]);
          suscriptores.push(snapshot.val()[suscriptor]);
        }

        enviarMail(suscriptores);
      }
    }, function (err) {
      console.log(err);
    });
  }

  enviarMail = function(suscriptores) {
    suscriptores = JSON.stringify(suscriptores);
    console.log(suscriptores);
    var paramentros = {
      enviarMail: true,
      datos: suscriptores
    }
    $.ajax({
       url: "php/visitas.php",
       type: "post",
       data: paramentros,
       success: function(data){
         if(data == '1') {
           console.log('ok');
           // $('#myModal').modal('hide');
         } else {
          console.log('error');
         }
       }
    });
  }
})

.controller('crtlSimulador', function($scope) {

	$scope.calcular = function() {
		$scope.letras = new Array();
		var interes = 0.02;
    var expireDate = new Date();
    // formula
    // interes * prestamo-solicitado / 1 - (1 + interes)^(-plazo_meses)
    var cuota = (interes * $scope.monto) / (1 - Math.pow(1 + interes, -$scope.plazo));
    var total = cuota * $scope.plazo;
    var saldo = total;

		for(i=1; i <= $scope.plazo; i++) {
			var letra = {};
			letra.numero = i;
			letra.vencimiento = expireDate;
      expireDate = new Date(expireDate.setMonth(expireDate.getMonth() + 1))
      saldo -= cuota;
			letra.saldoCapital = saldo;
			letra.capital = total;
			letra.cuota = cuota;
			letra.interes = (interes * 100) + '%';
			letra.otros = 19.00;
			$scope.letras.push(letra);
		}
	}

});
