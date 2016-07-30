var express    = require('express');
var readline   = require('readline');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('makers.db');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(input) {
  var data = input.toString();
  var makerId = data.slice(1,-1);
  db.each("SELECT card_id, name FROM makers WHERE card_id = (?)", function(err, row) {
    if (err) {
      console.log(err);
    } else {
      if (row) {
        console.log(row);
      } else {
        console.log('not found');
      }
    }
  });
});

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/makers.json', function(req, res) {
  db.all("SELECT card_id, name FROM makers", function(err, makers) {
    return res.json(makers);
  });
});

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
