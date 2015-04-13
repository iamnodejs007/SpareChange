var app = require('http').createServer();
var io = require('socket.io')(app);
var uuid = require('node-uuid');

app.listen(8080)

var Games = [];
var Connections = [];

io.on('connection', function (socket) {
  Connections.push(socket);
  var gameNo;
  var opponent;
  socket.emit('games', Games);
  socket.on('newGame', function() {
    gameNo = uuid.v4();
    socket.join(gameNo);
    Games.push(gameNo);
    console.log('new game');

    io.emit('games', Games);
  });
  socket.on('joinGame', function(gameNum) {
    socket.join(gameNum);
    gameNo = gameNum;
  });
  console.log('connected');
  socket.on('resetTurn', function () {
    console.log('resetTurn');
    socket.to(gameNo).emit('resetTurn');
  });
  socket.on('endTurn', function () {
    console.log('endTurn');
    socket.to(gameNo).emit('endTurn');
  });
  socket.on('mark', function (stackNo) {
    console.log(stackNo);
    socket.to(gameNo).emit('mark', stackNo);
  });
});
