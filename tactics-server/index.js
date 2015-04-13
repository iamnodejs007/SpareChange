var app = require('http').createServer();
var io = require('socket.io')(app);

app.listen(8080)

var Games = [];
var Connections = [];

io.on('connection', function (socket) {
  Connections.push(socket);
  var me = Connections.length-1;
  var opponent;
  socket.emit('games', Games);
  socket.on('newGame', function() {
    Games.push([me]);
    console.log('new game');

    socket.on('opponent', function(playerId) {
     opponent = Connections[playerId];
    });

    io.emit('games', Games);
  });
  socket.on('joinGame', function(gameNo) {
    opponent = Connections[Games[gameNo][0]];
    Games[gameNo].push(me);
    opponent.emit('myId', me);
  });
  console.log('connected');
  socket.on('resetTurn', function () {
    console.log('resetTurn');
    opponent.emit('resetTurn');
  });
  socket.on('endTurn', function () {
    console.log('endTurn');
    opponent.emit('endTurn');
  });
  socket.on('mark', function (stackNo) {
    console.log(stackNo);
    opponent.emit('mark', stackNo);
  });
});
