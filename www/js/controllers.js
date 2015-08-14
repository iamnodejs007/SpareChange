angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // sup

})

.controller('GameCtrl', function($scope, $ionicModal, GameState) {

  var pick = new Howl({ urls: ['sounds/pick_3.ogg'] });
  var take = new Howl({ urls: ['sounds/take_1.ogg'] });

  var noop = function(){};

  var powerups = [{
    name: 'add 3',
    action: noop,
  }, {
    name: 'take from smallest',
    action: forceSmallestStack
  }, {
    name: 'skip next turn',
    action: skipNextTurn
  }, {
    name: 'take from largest',
    action: forceLargestStack
  }, {
    name: 'only one coin',
    action: takeOneCoinOnly
  }, {
    name: 'redistribute coins',
    action: redistributeCoins 
  }];
  //, 'get fucked', 'quit game', 'go to hell', 'things break', 'black hole', 'cry'];

  function takeOneCoinOnly() {
    GameState.stacks[GameState.currentStack].marked = 1;
  }

  function skipNextTurn() {
    GameState.resetTurn();
  }

  $scope.setPowerup = function(powerup) {
    $scope.powerup = powerup;
  };

  function groupBy(array, num) {
    var ret = [];
    array.forEach(function(e, i) {
      if(i%num === 0) ret.push([]);
      ret[ret.length-1].push(e);
    });
    return ret;
  }

  $scope.powerups = groupBy(powerups, 4);

  $scope.$watch(function() { return GameState.update }, function() {
    $scope.stacks = GameState.stacks;
  });

  $scope.$watch(function() { return GameState.player }, function() {
    $scope.powerup = null;
    $scope.message = '';
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
    if(!$scope.powerup) {
      return alert('no powerup selected');
    }
    // alert that no powerup has been selected
    take.play();
    GameState.endTurn($scope.powerup);

    var left = 0;
    for(var i = 0; i < GameState.stacks.length; ++i)
      left+= GameState.stacks[i].coins;
    
    if(left <= 1) {
      alert('Game Over!');

      GameState.setup();
    }

  };
  
  function forceSmallestStack() { 
    var target = 0;

    for(var i = 0; i < GameState.stacks.length; i++) {
      
      if((GameState.stacks[i].coins < GameState.stacks[target].coins) &&
          GameState.stacks[target].coins !== 0 &&
          GameState.stacks[i].coins !== 0)
        target = i;
      else if(GameState.stacks[target].coins === 0) target++;
    }
   
   if(GameState.stacks[GameState.currentStack].coins === GameState.stacks[target].coins)
     return; 

    GameState.alternativeStack = target;
    if(GameState.stacks[target].coins < GameState.stacks[GameState.currentStack].marked)
      GameState.stacks[GameState.currentStack].marked = GameState.stacks[target].coins  
  };
  
  function forceLargestStack(){
    var target = 0;

    for(var i=0; i < GameState.stacks.length; i++){
      if(GameState.stacks[i].coins > GameState.stacks[target].coins)
        target = i; 
    }
   
    if(GameState.stacks[GameState.currentStack].coins === GameState.stacks[target].coins)
      return;
   
    GameState.alternativeStack = target;
  
  };
  
  function redistributeCoins() {
    var store = 0;
    
    for(var i = 0; i < GameState.stacks.length; i++) {
      store += GameState.stacks[i].coins;
      GameState.stacks[i].coins = 0
    };
    
    while(store > 0){
      
      var pos = Math.floor((Math.random()*GameState.stacks.length));
      GameState.stacks[pos].coins++;
      store--;
    };
  };

  $scope.doReset = function(maybe) {

    $scope.modal.hide();

    if(maybe) {
      $scope.message = '';
      GameState.resetTurn();
    }
    
  };

  $ionicModal.fromTemplateUrl('templates/areyousure.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.message = '';

  $scope.takeCoin = function(stackNo) {
    if(GameState.stacks[stackNo].marked == GameState.stacks[stackNo].coins) {
      return;
    }
    if(GameState.stacks[stackNo].marked == 3) {
      $scope.message = 'You can only take up to 3 coins';
      return;
    }
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

