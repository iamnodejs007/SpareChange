angular.module('starter.services', [/* 'btford.socket-io' */])
  .factory('GameState', function(/* GameSync */$timeout) {
    function defaultGameState() {
      return {
        numberOfStacks: 3,
        stacks: [],
        coinsPerStack: [3,4,5],
        currentStack: null,
        update: 0,
        trapPowerup: null,
        player: true, // true: player 1, false: player 2
        alternativeStack: null,
        skipped: false,
        frozenStack: []
      };
    }
    var GameState = defaultGameState();

    GameState.takeCoin = function(stackNo) {
      if(GameState.currentStack === null) {
        GameState.currentStack = stackNo;
      }
      if(GameState.currentStack === stackNo) {
        GameState.stacks[stackNo].marked++;
        GameState.update++;
        //GameSync.emit('mark', stackNo);
        return true;
      } else {
        GameState.update++;
        return false;
      }
    };

    GameState.resetTurn = function() {
      if(GameState.currentStack === null) return;
      GameState.stacks[GameState.currentStack].marked = 0;
      GameState.currentStack = null;
      GameState.update++;
      //GameSync.emit('resetTurn');
    };

    GameState.setup = function(options) {
      // Reset game state to defaults
      angular.extend(GameState, defaultGameState());
    
      if(options) GameState.numberOfStacks = options.numberOfStacks;
      
      if(options && options.coinsPerStack.length > 0) GameState.coinsPerStack = options.coinsPerStack;

      for(var i = 0; i < GameState.numberOfStacks; ++i)
        GameState.stacks[i] = {
          marked: 0,
          coins: GameState.coinsPerStack[i]
        };
      $timeout(function() {
        GameState.update++;
      }, 0);
    };

    GameState.endTurn = function(powerup, setMessage) {
      if(GameState.currentStack === null) return;
      if(powerup.type === 'active') powerup.action();
      if(GameState.trapPowerup) {
        GameState.trapPowerup.action();
        setMessage("Surprise! Opponent played " + GameState.trapPowerup.name);
      }
      if(powerup.type === 'trap') GameState.trapPowerup = powerup;
      else GameState.trapPowerup = null;
      var stack = GameState.currentStack;
      if(!GameState.skipped) {
        if(GameState.alternativeStack !== null) stack = GameState.alternativeStack;
        GameState.stacks[stack].coins -= GameState.stacks[GameState.currentStack].marked;
      }
      GameState.stacks[GameState.currentStack].marked = 0;
      if(GameState.stacks[stack].coins < 0) GameState.stacks[stack].coins = 0;
      GameState.currentStack = null;
      GameState.alternativeStack = null;
      GameState.skipped = false;
      GameState.player = !GameState.player;
      GameState.update++;
      //GameSync.emit('endTurn');
    };

    GameState.newGame = function() {
      //GameSync.emit('newGame');
    };

    GameState.joinGame = function(gameNo) {
      //GameSync.emit('joinGame', gameNo);
      GameState.gameNo = gameNo;
    }

    //GameSync.on('games', function(games) {
    //  console.log(JSON.stringify(games, null, 2));
    //  GameState.games = games;
    //});

    //GameSync.on('mark', function(stackNo) {
    //  if(!GameState.currentStack) {
    //    GameState.currentStack = stackNo;
    //  }
    //  GameState.stacks[stackNo].marked++;
    //  GameState.update++;
    //});

    //GameSync.on('resetTurn', function() {
    //  GameState.stacks[GameState.currentStack].marked = 0;
    //  GameState.currentStack = null;
    //});

    //GameSync.on('endTurn', function() {
    //  GameState.stacks[GameState.currentStack].coins -= GameState.stacks[GameState.currentStack].marked;
    //  GameState.stacks[GameState.currentStack].marked = 0;
    //  GameState.currentStack = null;
    //});


    return GameState;
  });
//  .factory('GameSync', function (socketFactory) {
//    return socketFactory({
//      ioSocket: io.connect('http://192.168.1.110:8080')
//    });
//  });
