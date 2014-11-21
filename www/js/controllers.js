angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('GameCtrl', function($scope, $ionicModal) {

  $scope.stacks = [];
  $scope.stacks.push({numCoins: 3});
  $scope.stacks.push({numCoins: 4});
  $scope.stacks.push({numCoins: 5});

  $scope.state = {
    stackNo: null,
    numCoins: 0
  };

  $scope.next = function() {
    if($scope.state.stackNo === null) {
      return;
    }
    console.log($scope.stacks[$scope.state.stackNo].numCoins);
    $scope.stacks[$scope.state.stackNo].numCoins -= $scope.state.numCoins;
    console.log($scope.stacks[$scope.state.stackNo].numCoins);

    var left = $scope.stacks.reduce(function(prev, curr) {
      return { numCoins: prev.numCoins+curr.numCoins };
    });

    if(left.numCoins <= 1) {
      alert('Game Over!');

      $scope.stacks = [];
      $scope.stacks.push({numCoins: 3});
      $scope.stacks.push({numCoins: 4});
      $scope.stacks.push({numCoins: 5});
    }

    $scope.state = {
      stackNo: null,
      numCoins: 0
    };
  };

  $scope.doReset = function(maybe) {

    $scope.modal.hide();

    if(maybe) {
      $scope.state = {
        stackNo: null,
        numCoins: 0
      };
    }

  };

  $ionicModal.fromTemplateUrl('templates/areyousure.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

 $scope.takeCoin = function(stack) {
    var no = $scope.state.stackNo;
    if(no !== null && stack !== no) {
      $scope.reset(stack);
      return;
    } else if(no === null) {
      $scope.state.stackNo = stack;
    }

    if($scope.stacks[stack].numCoins - $scope.state.numCoins <= 0) {
      alert('You can\'t do that.');
      return;
    }

    $scope.state.numCoins++;

  };

  $scope.reset = function(stack) {
    $scope.modal.show();
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

