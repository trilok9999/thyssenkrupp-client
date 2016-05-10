var responseJson = [
    {
      "product": [
        {
          "name": "Elevator"
        },
        {
          "name": "Escalator"
        }
      ],
    },
    {
      "product": [
        {
          "name": "Hydraulic"
        },
        {
          "name": "Elevator"
        }
      ],
    }
  ];

describe('productsCtrl', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.products', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('productsCtrl', { $scope: $scope });
    });

    it('sets the products scope with empty data', function() {
      expect($scope.products).to.deep.equal([]);
    });

    it('sets the products scope with data', function() {
      $scope.success(responseJson);
      expect($scope.products).to.be.a('Array');
    });

    it('sets the products scope with empty data when error', function() {
      $scope.error(responseJson);
      expect($scope.products).to.deep.equal([]);
    });

  });
});

describe('ticketsCtrl', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.products', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('ticketsCtrl', { $scope: $scope });
    });

    it('sets the products scope with empty data', function() {
      expect($scope.products).to.deep.equal([]);
    });

    it('sets the products scope with data', function() {
      $scope.success(responseJson);
      expect($scope.products).to.be.a('Array');
    });

    it('sets the products scope with empty data when error', function() {
      $scope.error(responseJson);
      expect($scope.products).to.deep.equal([]);
    });

  });
});