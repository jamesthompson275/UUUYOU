var sqlite = require('sqlite3').verbose()
var db = new sqlite.Database('UUUYou.db')

db.serialize(function () {

    db.run("CREATE TABLE IF NOT EXISTS ParkData (\
        partDataID INTEGER PRIMARY KEY\
    )");
    
    db.run("CREATE TABLE IF NOT EXISTS EventInfo (\
        eventInfoID INTEGER PRIMARY KEY,\
        title TEXT,\
        description TEXT,\
        cost TEXT,\
        timeStart TYPE,\
        timeStop TYPE,\
        venue TEXT,\
        venueAddress TEXT,\
        eventImage TEXT,\
        outdoors INTEGER\
    )");

    db.run("CREATE TABLE IF NOT EXISTS AddressLocation (\
        addressLocationID INTEGER PRIMARY KEY,\
        address TEXT,\
        latitude REAL,\
        longitude REAL\
    )");

});

db.close();