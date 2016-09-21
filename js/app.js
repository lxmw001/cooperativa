angular.module('coop',['ui.router'])
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

;