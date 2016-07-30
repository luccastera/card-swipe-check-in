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
  console.log('looking for maker with id = ' + makerId);
  db.get("SELECT card_id, name, checked_in FROM makers WHERE card_id = (?)", [makerId], function(err, maker) {
    if (err) {
      console.log(err);
    } else {
      if (maker) {
        console.log('Found maker', maker);
        if (maker.checked_in === 0) {
          // maker is checked out
          db.run("UPDATE makers SET checked_in = 1 WHERE card_id = (?)", [makerId], function(err) {
            console.log("maker with makerId" + makerId + " was checked in");

            db.get('SELECT rowid FROM checkins ORDER BY start_time DESC', function(err, checkin) {
              if (checkin) {
                var stmt = db.prepare("UPDATE checkins SET end_time = (?) WHERE rowid = (?)");
                stmt.run(new Date().toISOString(), checkin.rowid);
                stmt.finalize();
              }
            });
          });
        } else {
          // maker is checked in
          db.run("UPDATE makers SET checked_in = 0 WHERE card_id = (?)", [makerId], function(err) {
            console.log("maker with makerId" + makerId + " was checked out");

            var stmt = db.prepare("UPDATE checkins SET end_time = (?) WHERE maker_id");
            stmt.run(new Date().toISOString());
            stmt.finalize();
          });

        }

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

app.get('/checkedin_makers.json', function(req, res) {
  db.all("SELECT card_id, name FROM makers WHERE checked_in = 1", function(err, makers) {
    return res.json(makers);
  });
});

app.get('/checkins.json', function(req, res) {
  db.all("SELECT checkins.maker_id, checkins.start_time, checkins.end_time, makers.name FROM checkins, makers WHERE checkins.maker_id = makers.card_id ORDER BY start_time", function(err, checkins) {
    return res.json(checkins);
  });
});

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
