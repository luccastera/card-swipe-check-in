var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('makers.db');

db.serialize(function() {
  db.run("CREATE TABLE makers (card_id TEXT, firstname TEXT, lastname TEXT, city TEXT, state TEXT, checked_in INTEGER)");
  db.run("CREATE TABLE checkins (maker_id TEXT, start_time TEXT, end_time TEXT)");
});

db.close();
