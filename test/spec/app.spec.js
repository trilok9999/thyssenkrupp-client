'use strict';

describe('app factory', function () {
  var appFactory, httpBackend;

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
    },
  ];

  beforeEach(module('app'));

  beforeEach(function () {
    inject(function ($injector, $httpBackend) {
      appFactory = $injector.get('getData');
      httpBackend = $httpBackend;
    });
  });

  it('should be an Object', function () {
    expect(appFactory).to.be.an('Object');
    expect(appFactory.getFilteredList).to.be.a('function');
  });

  it('should have valid functions', function () {
    expect(appFactory.getFilteredList).to.be.a('function');
    expect(appFactory.getUniqueProducts).to.be.a('function');
  });

  it('should return unique products', function() {
    expect(appFactory.getUniqueProducts(responseJson)).to.be.an('Array');
    expect(appFactory.getUniqueProducts(responseJson)).to.deep.equal(['Elevator','Escalator','Hydraulic']);
  });

  it('should return filtered list', function() {
    expect(appFactory.getFilteredList(responseJson)).to.be.an('Array');
    expect(appFactory.getFilteredList(responseJson, 'Elevator')).to.deep.equal(responseJson);
  });


});
