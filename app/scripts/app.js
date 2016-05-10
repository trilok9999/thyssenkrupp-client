
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
.factory('getData',['$http',function($http) {

      // This function returns unique products from the response. Takes input JSON object with array of ticket information
    function getUniqueProducts(response) {
        var products = []
        
        response.forEach(function(obj) {
            obj.product.forEach(function(productObj) {
                if(products.indexOf(productObj.name) == -1) {
                    products.push(productObj.name);
                }
            })
        });
        return products;
    }

    // This function returns the filtered list of selected tickets.
    function getFilteredList(response, name) {
        var selected = [];

        response.forEach(function(obj){
            obj.product.forEach(function(productObj) {
                if (productObj.name===name) {
                    selected.push((obj));
                }
            })
        });
        return selected;
    }

    function getProducts(){
      // Calling our thyssenkrupp server to get products and ticket information
        return  $http.get('http://localhost:3000/getProducts').then(onSuccess, onError);
    };
    function onSuccess(response) {
        return response.data;
    };
    function onError(response) {
        return response.status;
    };
    return{
        getProducts:getProducts,
        getUniqueProducts: getUniqueProducts,
        getFilteredList: getFilteredList
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
