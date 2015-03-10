angular.module('starter.services', [])
  .factory('GameState', function() {
    var GameState = {
      numberOfStacks: 3,
      stacks: [],
      coinsPerStack: [3,4,5],
      currentStack: null
    };

    GameState.takeCoin = function(stackNo) {
      if(!GameState.currentStack) {
        GameState.currentStack = stackNo;
      }
      if(GameState.currentStack === stackNo) {
        GameState.stacks[stackNo].marked++;
        return true;
      }
      else return false;
    };

    GameState.resetTurn = function() {
      GameState.stacks[GameState.currentStack].marked = 0;
      GameState.currentStack = null;
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
    };


    return GameState;
  });
