var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
const io = require('socket.io')(server);
var buffer = require('buffer');
const { METHODS } = require('http');


var channel = can.createRawChannel("can0", true);

var carInfo = {};
carInfo.hid = 0
carInfo.speed = 0
carInfo.revs = 0

app.use(express.static(__dirname + "/html"));

var logstuff = (__dirname + "/html");

console.log('this is interesting: '+ logstuff);

app.use('/scripts', express.static(__dirname + '/node_modules/canvas-gauges/'));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

function toHex(number) {
    return ("00000000" + number.toString(16)).slice(-8);
  }

setInterval(() => {
    io.emit('carMessage', carInfo)
}, 700)

channel.start()

channel.addListener("onMessage", function(msg) { 
    carInfo.revs = msg.data.readUIntBE(0, 4)
    carInfo.speed = msg.data.readUIntBE(4, 2)
    carInfo.hid = toHex(msg.id).toUpperCase()
    console.log(carInfo.hid+' / '+carInfo.speed+' / '+carInfo.revs);
   console.log(msg.data);
  
})



server.listen(3020)
