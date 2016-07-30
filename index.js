var express    = require('express');
var SerialPort = require("serialport");

var port = new SerialPort('/dev/input/event0', {
  parser: SerialPort.parsers.readline('\n'),
  baudRate: 9600
});

port.on('data', function(data) {
  console.log(data);
});

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
