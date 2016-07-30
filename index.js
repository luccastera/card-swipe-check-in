var express    = require('express');
var readline   = require('readline');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('makers.db');
var bodyParser = require('body-parser')

function arrayRotate(arr, reverse) {
  if (reverse)
    arr.unshift(arr.pop());
  else
    arr.push(arr.shift());
  return arr;
} 

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(input) {
  var data = input.toString();

  // parse the drivers license string
  var licenseId = data.split('?;')[1].split('=')[0]; // drivers licence
  var names = data.split('^')[1].split('$');
  var lastname = names[0];
  var firstname = names.slice(1).join(' ');
  var cityAndState = data.split('^')[0].slice(1);
  var city = cityAndState.slice(2);
  var state = cityAndState.slice(0,2);

  db.get("SELECT card_id, firstname, lastname, checked_in FROM makers WHERE card_id = (?)", [licenseId], function(err, maker) {
    if (err) {
      console.log("There was an error attempting to find this maker.");
      console.log(err);
    } else {
      if (maker) {
        if (maker.checked_in === 0) {
          // maker is checked out
          db.run("UPDATE makers SET checked_in = 1 WHERE card_id = (?)", [licenseId], function(err) {
            console.log("Maker with maker ID " + licenseId + " was checked in.");

            var stmt = db.prepare("INSERT INTO checkins VALUES (?, ?, ?)");
            stmt.run(licenseId, new Date().toISOString(), null);
            stmt.finalize();
          });
        } else {
          // maker is checked in
          db.run("UPDATE makers SET checked_in = 0 WHERE card_id = (?)", [licenseId], function(err) {
            console.log("Maker with maker ID " + licenseId + " was checked out");

            db.get('SELECT rowid FROM checkins ORDER BY start_time DESC', function(err, checkin) {
              if (checkin) {
                var stmt = db.prepare("UPDATE checkins SET end_time = (?) WHERE rowid = (?)");
                stmt.run(new Date().toISOString(), checkin.rowid);
                stmt.finalize();
              }
            });
          });

        }

      } else {
        var stmt = db.prepare("INSERT INTO makers VALUES (?, ?, ?, ?, ?, ?)");
        stmt.run(licenseId, firstname, lastname, city, state, 1);
        stmt.finalize();

        var stmt2 = db.prepare("INSERT INTO checkins VALUES (?, ?, ?)");
        stmt2.run(licenseId, new Date().toISOString(), null);
        stmt2.finalize();

        console.log('Registered a new maker and checked him in: ' + firstname + ' ' + lastname);
      }
    }
  });
});

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/makers.json', function(req, res) {
  db.all("SELECT card_id, firstname, lastname, city, state FROM makers", function(err, makers) {
    return res.json(makers);
  });
});

app.get('/checkedin_makers.json', function(req, res) {
  db.all("SELECT card_id, firstname, lastname, city, state FROM makers WHERE checked_in = 1", function(err, makers) {
    return res.json(makers);
  });
});

app.get('/checkins.json', function(req, res) {
  db.all("SELECT checkins.maker_id, checkins.start_time, checkins.end_time, makers.firstname, makers.lastname, makers.city, makers.state FROM checkins, makers WHERE checkins.maker_id = makers.card_id ORDER BY start_time DESC", function(err, checkins) {
    return res.json(checkins);
  });
});

app.get('/register', function (req, res) {
  res.render('pages/register');
});

app.post('/register', function (req, res) {
  if (req.body.card_id && req.body.firstname && req.body.lastname) {
    var stmt = db.prepare("INSERT INTO makers VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(req.body.card_id, req.body.firstname, req.body.lastname, req.body.city, req.body.state, 0);
    stmt.finalize();
    return res.redirect('/')
  } else {
    return res.redirect('/register');
  }
});


app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
