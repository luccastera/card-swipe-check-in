var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('makers.db');

db.serialize(function() {
  db.run("CREATE TABLE makers (card_id TEXT, name TEXT, checked_in INTEGER)");
  db.run("CREATE TABLE checkins (maker_id TEXT, start_time TEXT, end_time TEXT)");
});

db.close();
