angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // sup

})

.controller('GameCtrl', function($scope, $ionicModal, GameState, $ionicPopup) {
  
  var pick = new Howl({ urls: ['sounds/pick_3.ogg'] });
  var take = new Howl({ urls: ['sounds/take_1.ogg'] });

  var noop = function(){};

  var powerups = [{
    name: 'Add 3',
    action: addOrRedistributeCoins(3),
    type: 'trap',
    description: 'Before your opponent takes their selected coins, 3 will be added randomly ' + 
                 'across the stacks. This includes the stacks with zero coins.'
  }, {
    name: 'Force Smallest',
    action: forceSmallestStack,
    type: 'trap',
    description: 'Your opponent will be forced to take their coins from the smallest stack, ' +
                 'instead of the stack they selected.'
  }, {
    name: 'Skip Turn',
    action: skipNextTurn,
    type: 'trap',
    description: 'Your opponent  will be forced to skip their turn.'
  }, {
    name: 'Force Largest',
    action: forceLargestStack,
    type: 'trap',
    description: 'Your opponent will be forced to take their coins from the largest stack, ' +
                 'instead of the stack they selected. '
  }, {
    name: 'Take One',
    action: takeOneCoinOnly,
    type: 'trap',
    description: 'Your opponent will only take a single coin instead of the amount they selected.'
  }, {
    name: 'Redistribute Coins',
    action: addOrRedistributeCoins(),
    type: 'trap',
    description: 'All the coins will be redistributed across the stacks. Your opponent will ' +
                 'then take the marked coins from what ends up in the stack they selected.'
  }, {
    name: 'Randomly Distribute Selected Coins',
    action: addSelectedRandomly,
    type: 'trap',
    description: 'The coins your opponent selects will be randomly added across the stacks, ' +
                 'instead of being taken.'
  }, {
    name: 'absolutely nothing',
    action: function() {},
    type: 'active',
    description: 'NOOOOOOOOOOOOOPE'
  }, {
    name: 'Take Extra Coin',
    action: takeExtraCoin,
    type: 'trap',
    description: 'Your opponent will take an extra coin along with what they meant to.'
  }, {
    name: 'Take Randomly',
    action: takeCoinsRandomly,
    type: 'trap',
    description: 'The number of coins your opponent marked will be taken randomly from all ' +
                 'of the stacks, instead of from the single stack that they select.'
  }, {
    name: 'Consolidate Stacks',
    action: consolidateStacks,
    type: 'trap',
    description: 'All the coins will be combined into a single stack.'
  }, {
    name: 'Add Extra Coin',
    action: addACoin,
    type: 'trap',
    description: 'Add a coin to the stack your opponent chooses to take coins from.'
  }, {
    name: 'freeze stack',
    action: freezeStack,
    type: 'trap',
    description: 'Select a stack. Your opponent will not be able to take coins from that stack next ' +
                 'turn. Your opponent will not know which stack you selected.'
  }];

  $scope.allpowerups = powerups;

  $scope.state = 'mainMenu';
 
  //, 'get fucked', 'quit game', 'go to hell', 'things break', 'black hole', 'cry'];
  
  $scope.optionselection = $scope.allpowerups[0];

  function freezeStack() {
    if(GameState.frozenStack[(!GameState.player).toString()] === GameState.currentStack) {
      skipNextTurn();
    }
  }

  function takeOneCoinOnly() {
    GameState.stacks[GameState.currentStack].marked = 1;
  }

  function skipNextTurn() {
    GameState.skipped = true;
  }

  $scope.incStack = function(index) {
    if($scope.gameInit.coinsPerStack[index] == 10) return;
    $scope.gameInit.coinsPerStack[index]++;
  };

  $scope.decStack = function(index) {
    if($scope.gameInit.coinsPerStack[index] == 1) return;
    $scope.gameInit.coinsPerStack[index]--;
  };

  $scope.waitingForSelection = false;

  $scope.setPowerup = function(powerup) {
    $scope.powerup = powerup.action;
    $scope.selectedPowerup = powerup;
    $scope.selectedPowerupName = powerup.name;

    $scope.message = '';
    if(powerup.name === 'freeze stack') {
      $scope.message = 'Please select which stack to freeze. Tap again to confirm.';
      $scope.waitingForSelection = true;
    } else if(powerup.name === 'take from multiple stacks') {
      // TODO
    }
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
    $scope.state = 'mainMenu';
    //GameState.stacks = null;
    //GameState.update++;
    $scope.newGameChoiceModal.hide();
  }

  $scope.rematch = function() {
    $scope.state = 'createGame';
    $scope.newGameChoiceModal.hide();
  }

  $scope.gameInit = {
    coinsPerStack: [],
    doWalkthrough: false
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

  $ionicModal.fromTemplateUrl('templates/powerupDescription.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.powerupDescriptionModal = modal;
  });

  
  
  $scope.togglePowerupDescription = function(powerup) {
    $scope.powerupToDescribe = powerup;
    $ionicPopup.show({
      templateUrl: 'templates/powerupDescription.html',
      title: powerup.name,
      scope: $scope,
      buttons: [
       { text: 'Done' }
      ]
    });
  };

  $scope.findGame = function () {
    $scope.state = 'createGame';
    //$scope.gamesModal.show();
  };

  $scope.closeGamesList = function() {
    $scope.gamesModal.hide();
  };

  $scope.pauseMenu = function() {
    $scope.state = 'pauseMenu';
    if(window.StatusBar) {
      window.StatusBar.show();
    }
  };

  $scope.continueGame = function() {
    if(window.StatusBar) {
      window.StatusBar.hide();
    }
    $scope.state = 'game';
  };

  $scope.abandonGame = function() {
    $scope.state = 'mainMenu';
  };

  $scope.newFromPause = function() {
    $scope.state = 'createGame';
  };

  $scope.newGame = function() {
    if(window.StatusBar) {
      window.StatusBar.hide();
    }
    $scope.state = 'game';
    // Because convert-to-number breaks the display
    $scope.gameInit.numberOfStacks = parseInt($scope.gameInit.numberOfStacks, 10);

    GameState.newGame();
    GameState.setup($scope.gameInit);
  };
  
  $scope.currentPlayer = 'Player One';

  $scope.joinGame = function(gameNo) {
    $scope.gamesModal.hide();
    GameState.joinGame(gameNo);
    GameState.setup();
  };
  
  $scope.showCards = function() {
   $scope.shownCards = true;
  }

  function hideCards() {
    $scope.shownCards = false;
  } 

  $scope.range = function(i) {
    //i = parseInt(i) || 0;
    if(typeof i !== 'number') {
     //console.log(i, typeof i);
     i = parseInt(i) || 0;
    }
    return new Array(i);
  }
  $scope.test = function() {
    console.log($scope.optionselection);
  };

  $scope.walkthroughs = {
  };

  $scope.endScreen1 = function() {
    $scope.walkthroughs.screen2 = true;
    GameState.currentStack = 1;
    GameState.stacks[1].marked = 3;
  };

  $scope.endScreen2 = function() {
    $scope.walkthroughs.screen3 = true;
    GameState.currentStack = null;
    GameState.stacks[1].marked = 0;
  };

  $scope.endScreen3 = function() {
    $scope.walkthroughs.screen4 = true;
    $scope.shownCards = true;
  };

  $scope.endScreen4 = function() {
    $scope.shownCards = false;
    $scope.powerups = drawCards();
  };

  $scope.toggleWalkthrough = function() {
    $scope.walkthroughs.screen1 = true;
    //console.log($scope.walkthroughs.isActive);
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
    if($scope.waitingForSelection) {
      $ionicPopup.show({
        template: 'You still need to select a stack to freeze!',
        title: 'Select a stack',
        scope: $scope,
        buttons: [
         { text: 'Done' }
        ]
      });
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
      // TODO: new game menu
      $scope.newGameChoiceModal.show();
      GameState.setup($scope.gameInit);
      $scope.powerup = null;
      $scope.selectedPowerupName = null;
      $scope.selectedPowerup = null;
      $scope.message = '';
    //  $scope.setupOptions(); 
    }
    hideCards();
    
    if(GameState.player === true) {
      $scope.currentPlayer = 'Player One';
    } else { 
      $scope.currentPlayer = 'Player Two';
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
  
  function addACoin() {
    GameState.stacks[GameState.currentStack].coins++;
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

  var once = false;
  var selected = null;
  $scope.takeCoin = function(stackNo) {
    if($scope.waitingForSelection) {
      // Not actually taking coin but selecting a stack for something
      
      if($scope.selectedPowerup.name === 'freeze stack') {
        if(once) {
          if(selected !== stackNo) {
            selected = stackNo;
            $scope.message = 'You have selected stack ' + stackNo + '. Tap again to confirm';
            return;
          }
          GameState.frozenStack[GameState.player.toString()] = stackNo;
          $scope.message = '';
          $scope.waitingForSelection = false;
          once = false;
          selected = null;
        } else {
          selected = stackNo;
          $scope.message = 'You have selected stack ' + stackNo + '. Tap again to confirm';
          once = true;
        }
      } else if($scope.selectedPowerup.name === 'take from multiple stacks') {
        // TODO
      }

      return;
    }
    if(GameState.stacks[stackNo].marked == GameState.stacks[stackNo].coins) {
      // If the player has already selected all the coins in the stack, can't take more
      return;
    }
    if(GameState.stacks[stackNo].marked == 3) {
      $scope.message = 'You can only take up to 3 coins';
      return;
    }
    if(!GameState.takeCoin(stackNo)) {
      $scope.message = 'You can only take coins from a single stack'; 
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
      position: 'absolute',
    }

    if(coin == 0) {
    } else if(coin == 1) {
      style.top = '-0px';
    } else {
      style.top = '-' + (10*(coin-1)) + 'px';
    }

    return style;
  };

});

