var express    = require('express');
var readline   = require('readline');
var SerialPort = require("serialport");

var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

stdin.on( 'data', function( key ){
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  // write the key to stdout all normal like
  process.stdout.write( key );
});

var port = new SerialPort('/dev/input/event0', {
});

port.on('data', function(data) {
  //console.log(data);
  //var str = data.toString('utf8');
  //console.log('---');
  //console.log(str);
  stdin.write(data);
});

var rl = readline.createInterface({
  input: stdin
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
