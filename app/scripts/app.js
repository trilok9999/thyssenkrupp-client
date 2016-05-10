
angular.module('app', ['ionic', 'app.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// Services are here. Usually they are placed in services.js, since it's minimal, placed inside the main app
.factory('getData',['$http',function($http){
    return{
        getProducts:getProducts
    };
    function getProducts(){
      // Calling our thyssenkrupp server to get products and ticket information
        return  $http.get('http://localhost:3000/getProducts').then(Onsuccess, OnError);
    };
    function Onsuccess(response){
        return response.data;
    };
    function OnError(response){
        return response.status;
    };
}])

// Routings/Configs are here. Usually they are placed in routes.js, since it's minimal, placed inside the main app
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  // Product Routing
  .state('menu.products', {
    url: '/products',
    views: {
      'side-menu21': {
        templateUrl: 'templates/products.html',
        controller: 'productsCtrl'
      }
    }
  })

  // Ticket Routing
  .state('menu.tickets', {
    url: '/tickets/:name',
    views: {
      'side-menu21': {
        templateUrl: 'templates/tickets.html',
        controller: 'ticketsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/side-menu21/products')
  
});
