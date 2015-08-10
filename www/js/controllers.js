angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // sup

})

.controller('GameCtrl', function($scope, $ionicModal, GameState) {

  var pick = new Howl({ urls: ['sounds/pick_1.ogg'] });
  var take = new Howl({ urls: ['sounds/take_1.ogg'] });

  $scope.$watch(function() { return GameState.update }, function() {
    $scope.stacks = GameState.stacks;
  });

  $scope.$watch(function() { return GameState.games }, function() {
    $scope.games = GameState.games;
  });
  
  $scope.setupOptions = function() {    
    $scope.gamesModal.hide();
    $scope.optionsModal.show();
  };

  $scope.gameInit = {
    numberOfStacks: 0,
    coinsPerStack: []
  };

  $scope.closeOptions = function() {
    $scope.optionsModal.hide();
    $scope.gamesModal.show();
  };

  $ionicModal.fromTemplateUrl('templates/options.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.optionsModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/games.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.gamesModal = modal;
  });

  $scope.findGame = function() {
    $scope.gamesModal.show();
  };

  $scope.closeGamesList = function() {
    $scope.gamesModal.hide();
  };

  $scope.newGame = function() {
    $scope.optionsModal.hide();
    GameState.newGame();
    //throw in variables for the number of coins in the first stack and how many stacks
    GameState.setup($scope.gameInit);
  };

  $scope.joinGame = function(gameNo) {
    $scope.gamesModal.hide();
    GameState.joinGame(gameNo);
    GameState.setup();
  };

  $scope.range = function(i) {
    i = parseInt(i) || 0;
    return new Array(i);
  }

  $scope.next = function() {
    take.play();
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
    else pick.play();
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

