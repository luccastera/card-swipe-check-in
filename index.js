var express    = require('express');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var port = new SerialPort('/dev/input/event0', {
  baudrate: 9600,
  parser: serialport.parsers.readline('\r\n')
});

port.on('data', function(data) {
  console.log(data);
  var str = data.toString();
  console.log(str);
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
