//var Keyboard = require('node-keyboard');
var express    = require('express');
var SerialPort = require("serialport");
var port = new SerialPort('/dev/input/event0');

port.on('data', function(data) {
  console.log( data);
});

var makers = [];

var app = express();

app.get('/', function (req, res) {
  res.send('Card Swipe Reader');
});

app.get('/makers.json', function(req, res) {
  return res.json(makers);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
