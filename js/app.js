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
     .state('servicios', {
          url: '/servicios',
          templateUrl: 'templates/servicios.html',
          controller: 'crtlServicios'
      })

     /*Rutas para Cuentas*/
     .state('ahorros', {
          url: '/ahorros',
          templateUrl: 'templates/cuentas/ahorros.html',
          controller: ''
      })

     /*Rutas para Depositos*/
     .state('plazo_fijo', {
          url: '/plazo_fijo',
          templateUrl: 'templates/depositos/plazo_fijo.html',
          controller: ''
      })

     .state('creditos', {
          url: '/creditos',
          templateUrl: 'templates/creditos/creditos.html',
          controller: ''
      })

     .state('micro_creditos', {
          url: '/micro_creditos',
          templateUrl: 'templates/creditos/micro_creditos.html',
          controller: ''
      })


  $urlRouterProvider.otherwise('/');

})

.controller('crtlHome', function($scope) {
  console.log('Controller Home');
})

.controller('crtlServicios', function($scope) {
  console.log('Controller Servicios');
})

.controller('crtlContactos', function($scope) {
  console.log('Controller Contactos');
});