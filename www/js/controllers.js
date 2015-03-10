angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('GameCtrl', function($scope, $ionicModal, GameState) {

  $scope.$watch(function() { return GameState.stacks }, function() {
    $scope.stacks = GameState.stacks;
  });

  GameState.setup();

  $scope.range = function(i) {
    return new Array(i);
  }

  $scope.next = function() {
    GameState.endTurn();

    var left = 0;
    for(var i = 0; i < GameState.stacks.length; ++i)
      left+= GameState.stacks[i].coins;
    
    if(left <= 1) {
      alert('Game Over!');

      GameState.setup();
    }

  };

  $scope.doReset = function(maybe) {

    $scope.modal.hide();

    if(maybe) {
      GameState.resetTurn();
    }

  };

  $ionicModal.fromTemplateUrl('templates/areyousure.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.takeCoin = function(stackNo) {
    if(!GameState.takeCoin(stackNo))
      $scope.reset(stackNo);
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
    if(stack === GameState.currentStack &&
        coin >= $scope.stacks[stack].coins - $scope.stacks[stack].marked) {
      gray = ' grayscale';
    }
    if($scope.stacks[stack].coins <= coin) return 'invis';
    else return names[stack]+'-'+names[coin]+gray;
  };

});

