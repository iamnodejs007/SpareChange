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
    action: addOrRedistributeCoins(3),
    type: 'trap'
  }, {
    name: 'take from smallest',
    action: forceSmallestStack,
    type: 'trap'
  }, {
    name: 'skip next turn',
    action: skipNextTurn,
    type: 'trap'
  }, {
    name: 'take from largest',
    action: forceLargestStack,
    type: 'trap'
  }, {
    name: 'only one coin',
    action: takeOneCoinOnly,
    type: 'trap'
  }, {
    name: 'redistribute coins',
    action: addOrRedistributeCoins(),
    type: 'trap'
  }, {
    name: 'randomly distribute selected coins',
    action: addSelectedRandomly,
    type: 'trap'
  }, {
    name: 'absolutely nothing',
    action: function() {},
    type: 'active'
  }, {
    name: 'take an extra coin',
    action: takeExtraCoin,
    type: 'trap'
  },  {
    name: 'take randomly',
    action: takeCoinsRandomly,
    type: 'trap'
  }, {
    name: 'consolidate the stacks',
    action: consolidateStacks,
    type: 'trap'
  }];

  $scope.allpowerups = powerups;
 
  //, 'get fucked', 'quit game', 'go to hell', 'things break', 'black hole', 'cry'];
  
  $scope.optionselection = $scope.allpowerups[0];


  function takeOneCoinOnly() {
    GameState.stacks[GameState.currentStack].marked = 1;
  }

  function skipNextTurn() {
    GameState.skipped = true;
  }

  $scope.setPowerup = function(powerup) {
    $scope.powerup = powerup.action;
    $scope.selectedPowerup = powerup;
    $scope.selectedPowerupName = powerup.name;
  };

  $scope.powerupClass = function(name) {
    var css = 'powerup w3-card-4';
    if($scope.selectedPowerup && ($scope.selectedPowerup.name === name)) css += ' grayscale';
    return css;
  };

  function groupBy(array, num) {
    var ret = [];
    array.forEach(function(e, i) {
      if(i%num === 0) ret.push([]);
      ret[ret.length-1].push(e);
    });
    return ret;
  }

  function contains(arr, val) {
    var cont = false;
    arr.forEach(function(e) { if(val === e) cont = true });
    return cont;
  }
  
  function drawCards() {
    var arr = [];
    var rand;
    while(arr.length < 3){
      rand = randFromZeroToX(powerups.length);
      if(!contains(arr, rand)) {
        arr.push(rand);
      }
    }
    return arr.map(function(e) { return powerups[e]; });
  }

  $scope.powerups = drawCards();

  $scope.$watch(function() { return GameState.update }, function() {
    $scope.stacks = GameState.stacks;
  });

  $scope.$watch(function() { return GameState.player }, function() {
    $scope.powerup = null;
    $scope.selectedPowerupName = null;
    $scope.selectedPowerup = null;
    $scope.powerups = drawCards();
  });

  $scope.$watch(function() { return GameState.games }, function() {
    $scope.games = GameState.games;
  });
  
  $scope.setupOptions = function() {    
    $scope.gamesModal.hide();
    $scope.newGameChoiceModal.hide();
    $scope.optionsModal.show();
  };

  $scope.toMenu = function () {
    GameState.stacks = null;
    GameState.update++;
    $scope.newGameChoiceModal.hide();
  }

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

  $ionicModal.fromTemplateUrl('templates/newGameChoice.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.newGameChoiceModal = modal;
  }); 
  
  $scope.findGame = function () {
    $scope.gamesModal.show();
  }

  $scope.closeGamesList = function() {
    $scope.gamesModal.hide();
  };

  $scope.newGame = function() {
    if($scope.gameInit.numberOfStacks < 3 || $scope.gameInit.numberOfStacks > 10) {
      $scope.stacksValidationMessage = "Create a game with a number of stacks in the range of 3 to 10";   
    } else {
      $scope.optionsModal.hide();
      GameState.newGame();
      GameState.setup($scope.gameInit);
    };
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
  $scope.test = function() {
    console.log($scope.optionselection);
  };

  $scope.next = function() {
    if(GameState.currentStack === null) {
      $scope.message = "You must select at least one coin.";
      return;
    }
    if(!$scope.selectedPowerup) {
      $scope.message = "No powerup selected";
      return; 
    }
    // sound effect
    take.play();
    GameState.endTurn($scope.selectedPowerup, function(msg) {
      $scope.message = msg;
    });

    var left = 0;
    for(var i = 0; i < GameState.stacks.length; ++i)
      left+= GameState.stacks[i].coins;
    
    if(left <= 1) {
      $scope.newGameChoiceModal.show();
      GameState.setup($scope.gameInit);
      $scope.powerup = null;
      $scope.selectedPowerupName = null;
      $scope.selectedPowerup = null;
      $scope.message = '';
    //  $scope.setupOptions(); 
    }

  };

  function forceSmallestStack() { 
    var target = 0;

    for(var i = 0; i < GameState.stacks.length; i++) {
      
      if((GameState.stacks[i].coins < GameState.stacks[target].coins) &&
          GameState.stacks[target].coins !== 0 &&
          GameState.stacks[i].coins !== 0) {

        target = i;
      } else if(GameState.stacks[target].coins === 0) {
        target++;
      }
    }
   
   if(GameState.stacks[GameState.currentStack].coins === GameState.stacks[target].coins)  return;

    GameState.alternativeStack = target;
    if(GameState.stacks[target].coins < GameState.stacks[GameState.currentStack].marked) {
      GameState.stacks[GameState.currentStack].marked = GameState.stacks[target].coins  
    }
  };
  
  function forceLargestStack(){
    var target = 0;

    for(var i=0; i < GameState.stacks.length; i++){
      if(GameState.stacks[i].coins > GameState.stacks[target].coins) target = i; 
    }
   
    if(GameState.stacks[GameState.currentStack].coins === GameState.stacks[target].coins) return;
   
    GameState.alternativeStack = target;
  
  };
  
  function addOrRedistributeCoins(num) {
    return function() {
      var store = 0;
       
      if(num == null){ 
        //random redistribution of all coins 
        for(var i = 0; i < GameState.stacks.length; i++) {
          store += GameState.stacks[i].coins;
          GameState.stacks[i].coins = 0;
        };
      } else {
        //addition of 3 coins onto the field
        store = num;    
      }
        
      while(store > 0){ 
        var pos = randFromZeroToX(GameState.stacks.length);
        
        GameState.stacks[pos].coins++;
        store--; 
      };
    
    } 
  };

  function addSelectedRandomly() {
  
    for(var i = 0; i < GameState.stacks[GameState.currentStack].marked; i++) {
      var pos = randFromZeroToX(GameState.stacks.length);
      GameState.stacks[pos].coins++; 
    };

  };

  function takeExtraCoin() {
    GameState.stacks[GameState.currentStack].marked += 1;
  };
  
  function takeCoinsRandomly() {
    
    for(var i = 0; i < GameState.stacks[GameState.currentStack].marked ; i++) { 
      GameState.stacks[randFromZeroToX(GameState.stacks.length)].coins--;
    } 

    GameState.stacks[GameState.currentStack].marked = 0;

  };

  function consolidateStacks() {
    
    var totalCoins = 0;
    var store = GameState.stacks[GameState.currentStack].marked;

    for( var i = 0; i < GameState.stacks.length; i++) {
      totalCoins += GameState.stacks[i].coins;
      GameState.stacks[i].coins = 0;
    }
    
    var pos = Math.floor(randFromZeroToX(GameState.stacks.length))
    
    GameState.stacks[pos].coins = totalCoins - store;

  } 

  function randFromZeroToX(x) {
    return Math.floor((Math.random()*x))
  }
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
      // If the player has already selected all the coins in the stack, can't take more
      return;
    }
    if(GameState.stacks[stackNo].marked == 3) {
      $scope.message = 'You can only take up to 3 coins';
      return;
    }
    if(!GameState.takeCoin(stackNo)) {
      $scope.reset(stackNo);
    } else {
      // Sound effect
      pick.play();
    }
  };
 
  $scope.reset = function(stack) {
    $scope.modal.show();
  };

  $scope.getCss = function(stack, coin) {
    var css = '';
    if(stack === GameState.currentStack &&
        coin >= $scope.stacks[stack].coins - $scope.stacks[stack].marked) {
      css = 'grayscale';
    }
    if($scope.stacks[stack].coins <= coin) return 'invis';
    else return css;
  };

  $scope.getStyle = function(stack, coin) {
    var style = {
      position: 'absolute'
    }

    if(coin == 0) {
    } else if(coin == 1) {
      style.top = '-4px';
    } else {
      style.top = '-' + (14*(coin-1)+4) + 'px';
    }

    return style;
  };

});

