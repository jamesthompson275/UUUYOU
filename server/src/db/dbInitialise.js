import sqlite from 'sqlite3';

module.exports = {
    initialiseDb : function() {
        var db = new sqlite.Database('UUUYou.db');

        db.serialize(function () {
            
            db.run("CREATE TABLE IF NOT EXISTS EventInfo (\
                title TEXT,\
                description TEXT,\
                cost TEXT,\
                timeStart TEXT,\
                timeStop TEXT,\
                venue TEXT,\
                venueAddress TEXT,\
                eventImage TEXT,\
                bookings TEXT,\
                category TEXT,\
                weblink TEXT,\
                age TEXT,\
                meetTEXTingPoint TEXT,\
                requirements TEXT,\
                showType TEXT,\
                schedule TEXT,\
                PRIMARY KEY (title, timeStart, venue)\
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

