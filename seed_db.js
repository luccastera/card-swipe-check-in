var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('makers.db');

db.serialize(function() {
  var stmt = db.prepare("INSERT INTO makers VALUES ('000049', 'Luc', 0)");
  stmt.run();
  stmt.finalize();

  db.each("SELECT card_id, name FROM makers", function(err, row) {
    console.log(row.card_id + ": " + row.name);
  });
});

db.close();
