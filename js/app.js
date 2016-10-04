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

     .state('conocenos', {
          url: '/conocenos',
          templateUrl: 'templates/conocenos.html',
          controller: 'crtlConocenos'
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

.controller('crtlHome', function($scope, $rootScope, $state) {
  $rootScope.state = 'home';

  $scope.showSimulador = function() {
    $state.go('simulador');
  }
})

.controller('crtlCuentas', function($scope, $rootScope) {
  $rootScope.state = 'cuentas';
})

.controller('crtlDepositos', function($scope, $rootScope) {
  $rootScope.state = 'depositos';
})

.controller('crtlCreditos', function($scope, $rootScope) {
  $rootScope.state = 'creditos';
})

.controller('crtlMicro', function($scope, $rootScope) {
  $rootScope.state = 'micro';
})

.controller('crtlConocenos', function($scope, $rootScope) {
  $rootScope.state = 'conocenos';
})

.controller('crtlContactanos', function($scope, $rootScope) {
  $rootScope.state = 'contactanos';
})

.controller('crtlContador', function($scope, $firebase) {

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
    console.log(encoded);
    return encoded;
  }

  decodeMail = function(email) {
    return email.replace('@punto@', '.');
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

.controller('crtlSimulador', function($scope, $firebase, $firebaseAuth) {
	
	$scope.calcular = function() {
		$scope.letras = new Array();
		var interes = 11;
		
		for(i=1; i <= $scope.plazo; i++) {
			var letra = {};
			letra.numero = i;
			letra.vencimiento = "10/09/2018";
			letra.saldoCapital = $scope.monto;
			letra.capital = $scope.monto;
			letra.cuota = $scope.monto / $scope.plazo;
			letra.interes = 11.57;
			letra.otros = 19.00;
			$scope.letras.push(letra);
		}
	}

});
