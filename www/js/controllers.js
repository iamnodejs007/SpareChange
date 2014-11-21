angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('GameCtrl', function($scope) {

  $scope.stacks = [];
  $scope.stacks.push({numCoins: 3});
  $scope.stacks.push({numCoins: 4});
  $scope.stacks.push({numCoins: 5});

  $scope.state = {
    stackNo: null,
    numCoins: 0
  };

  $scope.next = function() {
    console.log($scope.stacks[$scope.state.stackNo].numCoins);
    $scope.stacks[$scope.state.stackNo].numCoins -= $scope.state.numCoins;
    console.log($scope.stacks[$scope.state.stackNo].numCoins);

    $scope.state = {
      stackNo: null,
      numCoins: 0
    };
  };

  $scope.takeCoin = function(stack) {
    var no = $scope.state.stackNo;
    if(no !== null && stack !== no) {
      $scope.reset(stack);
      return;
    } else if(no === null) {
      $scope.state.stackNo = stack;
    }

    if($scope.stacks[stack].numCoins - $scope.state.numCoins <= 0) {
      throw 'dumbass';
    }

    $scope.state.numCoins++;

  };

  $scope.reset = function(stack) {
    throw 'are you sure?';
  };

  $scope.getCss = function(stack, coin) {
    var names = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five"
    ];

    var gray = '';
    if(stack === $scope.state.stackNo &&
        coin >= $scope.stacks[stack].numCoins - $scope.state.numCoins) {
      gray = ' grayscale';
    }
    if($scope.stacks[stack].numCoins <= coin) return 'invis';
    else return names[stack]+'-'+names[coin]+gray;
  };

});

