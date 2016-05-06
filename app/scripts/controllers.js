angular.module('app.controllers', [])

// Products controller handles list of product information
.controller('productsCtrl', ["$scope","getData",function($scope,getData) {
    $scope.products=[];
    getData.getProducts().then(Success,Error);

    function Success(response){
        $scope.products=getUniqueProducts(response);
        console.log(response);
    }

    function Error(response){
        console.log("Failed");
    }
}])

// Tickets Controller handles the ticket template scopes
.controller('ticketsCtrl',["$scope","$stateParams","getData",function($scope,$stateParams,getData){

    $scope.products=[];
    getData.getProducts().then(Success,Error);

    function Success(response){
        $scope.products=getFilteredList(response,$stateParams.name);
        console.log($scope.products);
    }

    function Error(response){
        console.log("Failed");
    }
}]);

// This function returns unique products from the response. Takes input JSON object with array of ticket information
function getUniqueProducts(response){
    var products = []
    
    response.forEach(function(obj){
        obj.product.forEach(function(productObj){
            if(products.indexOf(productObj.name)==-1) {
                products.push(productObj.name);
            }
        })
    });
    return products;
}

// This function returns the filtered list of selected tickets.
function getFilteredList(response, name){
    var selected = [];

    response.forEach(function(obj){
        obj.product.forEach(function(productObj){
            if (productObj.name===name){
                selected.push((obj));
            }
        })
    });
    return selected;
}
