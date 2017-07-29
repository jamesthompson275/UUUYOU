import sqlite from 'sqlite3';

module.exports = {
    initialiseDb : function() {
        var db = new sqlite.Database('UUUYou.db');

        db.serialize(function () {
            
            db.run("CREATE TABLE IF NOT EXISTS EventInfo (\
                eventInfoID INTEGER PRIMARY KEY,\
                title TEXT,\
                label TEXT,\
                cost TEXT,\
                timeStart TEXT,\
                timeStop TEXT,\
                address TEXT,\
                latitude REAL,\
                longitude REAL,\
                eventImage TEXT,\
                outdoors INTEGER\
            )");

            db.run("CREATE TABLE IF NOT EXISTS Venues (\
                venueID TEXT PRIMARY KEY,\
                venueType TEXT,\
                address TEXT,\
                latitude REAL,\
                longitude REAL\
            )");

            db.run("CREATE TABLE IF NOT EXISTS Parks (\
                parkID TEXT PRIMARY KEY,\
                name TEXT\
            )");

            db.run("CREATE TABLE IF NOT EXISTS Items (\
                itemID TEXT PRIMARY KEY,\
                type TEXT,\
                label TEXT,\
                latitude REAL,\
                longitude REAL,\
                park TEXT,\
                FOREIGN KEY(type) REFERENCES ItemTypes(itemTypeID),\
                FOREIGN KEY(park) REFERENCES Parks(parkID)\
            )");

            db.run("CREATE TABLE IF NOT EXISTS ItemTypes (\
                itemTypeID TEXT PRIMARY KEY,\
                description TEXT,\
                quantity INTEGER,\
                use INTEGER DEFAULT 0\
            )");

            db.run("CREATE TABLE IF NOT EXISTS Reviews (\
                reviewID INTEGER PRIMARY KEY,\
                item TEXT,\
                positive INTEGER,\
                FOREIGN KEY(item) REFERENCES Items(itemID)\
            )")

            console.log("Created DB tables");
        });
    }
}

