var express    = require('express');
var readline   = require('readline');
var SerialPort = require("serialport");

var port = new SerialPort('/dev/input/event0', {
});

port.on('data', function(data) {
  console.log(data);
  //var str = data.toString('utf8');
  //console.log('---');
  //console.log(str);
  process.stdin.write(data);
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(input) {
  var makerId = input.slice(1,1);
  console.log(makerId + ' maker just swiped');
  if (makers.indexOf(makerId) > 0) {
    makers.push(makerId);
  }
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
