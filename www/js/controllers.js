angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('GameCtrl', function($scope) {

  $scope.stacks = [];
  $scope.stacks.push({numCoins: 3});
  $scope.stacks.push({numCoins: 4});
  $scope.stacks.push({numCoins: 5});

  $scope.getCss = function(stack, coin) {
    var names = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five"
    ];
    return names[stack]+'-'+names[coin];
  };

});

