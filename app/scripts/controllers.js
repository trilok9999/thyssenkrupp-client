angular.module('app.controllers', [])

// Products controller handles list of product information
.controller('productsCtrl', ["$scope", "getData", function($scope, getData) {
    $scope.products=[];

    $scope.success = function(response){
        $scope.products = getData.getUniqueProducts(response);
        console.log(response);
    }

    $scope.error = function(response){
        console.log("Failed");
    }

    getData.getProducts().then($scope.success, $scope.error);

}])

// Tickets Controller handles the ticket template scopes
.controller('ticketsCtrl',["$scope", "$stateParams", "getData", function($scope, $stateParams, getData){

    $scope.products = [];

    $scope.success = function(response){
        $scope.products = getData.getFilteredList(response, $stateParams.name);
        console.log($scope.products);
    }

    $scope.error = function(response){
        console.log("Failed");
    }

    getData.getProducts().then($scope.success, $scope.error);
}]);
