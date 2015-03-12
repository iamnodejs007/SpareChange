var app = require('express')();
var io = require('socket.io')(app.listen(8080));


//app.get('/', function (req, res) {
//  res.sendfile(__dirname + '/index.html');
//});

io.on('connection', function (socket) {
  console.log('connected');
  socket.on('resetTurn', function (data) {
    console.log('resetTurn');
  });
  socket.on('endTurn', function (data) {
    console.log('endTurn');
  });
  socket.on('mark', function (data) {
    console.log(data);
  });
});
