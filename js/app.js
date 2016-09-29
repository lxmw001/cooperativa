angular.module('coop',['ui.router', 'firebase'])
.run(function($state) {
  console.log('hola mundo');
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


  $urlRouterProvider.otherwise('/');

})

.controller('crtlHome', function($scope, $rootScope) {
  $rootScope.state = 'home';
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

.controller('crtlSuscripcion', function($scope, $firebase, $firebaseAuth) {

  var clientFB;

  $scope.nombre = 'luis';
  $scope.apellido = 'gonzalez';
  $scope.email = 'lgonzalez';
  $scope.telefono = '023423';
  $scope.comentario = 'asdfads';

  $scope.suscribir = function() {
    var path = 'https://coopartamos-4616a.firebaseio.com/suscriptores/' + $scope.email;
    clientFB = new Firebase(path);
    console.log('suscribir');
    var suscriptor = {
      nombre : $scope.nombre,
      apellido : $scope.apellido,
      email : $scope.email,
      telefono : $scope.telefono,
      comentario : $scope.comentario
    }

    verificarSuscriptor(function() {
      clientFB.update(suscriptor);
      limpiarDatosSuscripcion();
      mostrarMensaje('Suscrito correctamente');
    });
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
    $scope.nombre = '';
    $scope.apellido = '';
    $scope.email = '';
    $scope.telefono = '';
    $scope.comentario = '';
  }

  mostrarMensaje = function(mensaje) {
    console.log('mostrar Mensaje');
    Materialize.toast(mensaje, 3000, 'rounded') // 'rounded' is the class I'm applying to the toast
  }

  obtenerSuscriptores = function(callback) {
    var path = 'https://coopartamos-4616a.firebaseio.com/suscriptores';
    clientFB = new Firebase(path);
    clientFB.once('value', function(snapshot) {
      if (snapshot.val()) {
        // enviar por correo estos datos o lo q el cliente quiere hacer
        callback(snapshot.val())
      }
    }, function (err) {
      console.log(err);
    });
  }
})

;