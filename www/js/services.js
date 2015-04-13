angular.module('starter.services', ['btford.socket-io'])
  .factory('GameState', function(GameSync) {
    var GameState = {
      numberOfStacks: 3,
      stacks: [],
      coinsPerStack: [3,4,5],
      currentStack: null,
      update: 0
    };

    GameState.takeCoin = function(stackNo) {
      if(!GameState.currentStack) {
        GameState.currentStack = stackNo;
      }
      if(GameState.currentStack === stackNo) {
        GameState.stacks[stackNo].marked++;
        GameSync.emit('mark', stackNo);
        return true;
      }
      else return false;
    };

    GameState.resetTurn = function() {
      GameState.stacks[GameState.currentStack].marked = 0;
      GameState.currentStack = null;
      GameState.update++;
      GameSync.emit('resetTurn');
    };

    GameState.setup = function(options) {
      for(var i = 0; i < GameState.numberOfStacks; ++i)
        GameState.stacks[i] = {
          marked: 0,
          coins: GameState.coinsPerStack[i]
        };
    };

    GameState.endTurn = function() {
      GameState.stacks[GameState.currentStack].coins -= GameState.stacks[GameState.currentStack].marked;
      GameState.stacks[GameState.currentStack].marked = 0;
      GameState.currentStack = null;
      GameState.update++;
      GameSync.emit('endTurn');
    };

    GameState.newGame = function() {
      GameSync.emit('newGame');
    };

    GameState.joinGame = function(gameNo) {
      GameSync.emit('joinGame', gameNo);
      GameState.gameNo = gameNo;
    }

    GameSync.on('games', function(games) {
      console.log(JSON.stringify(games, null, 2));
      GameState.games = games;
    });

    GameSync.on('mark', function(stackNo) {
      if(!GameState.currentStack) {
        GameState.currentStack = stackNo;
      }
      GameState.stacks[stackNo].marked++;
      GameState.update++;
    });

    GameSync.on('resetTurn', function() {
      GameState.stacks[GameState.currentStack].marked = 0;
      GameState.currentStack = null;
    });

    GameSync.on('endTurn', function() {
      GameState.stacks[GameState.currentStack].coins -= GameState.stacks[GameState.currentStack].marked;
      GameState.stacks[GameState.currentStack].marked = 0;
      GameState.currentStack = null;
    });


    return GameState;
  })
  .factory('GameSync', function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://192.168.1.110:8080')
    });
  });
