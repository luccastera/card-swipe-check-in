var express    = require('express');
var StringDecoder = require('string_decoder').StringDecoder;
//var SerialPort = require("serialport");
//var port = new SerialPort('/dev/input/event0', {
//});

//port.on('data', function(data) {
  //console.log(data);
  //var decoder = new StringDecoder('hex');
  ////console.log(data);
  ////var buff = new Buffer(data);
  ////var str = data.toString('hex');
  //decoder.write(data);
  //var str = decoder.end();
  //console.log(str);
//});

var Keyboard = require('./keyboard.js');
var k = new Keyboard('event0'); // 'event2' is the file corresponding to my keyboard in /dev/input/
k.on('keyup', console.log);
k.on('keydown', console.log);
k.on('keypress', console.log);
k.on('error', console.error);

var makers = [];

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/makers.json', function(req, res) {
  return res.json(makers);
});

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
