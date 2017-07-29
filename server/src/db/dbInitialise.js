import sqlite from 'sqlite3'
var db = new sqlite.Database('UUUYou.db')

module.exports = {
    initialiseDb : function() {
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

            db.run("CREATE TABLE IF NOT EXISTS Parks (\
                parkID INTEGER PRIMARY KEY,\
                name TEXT\
            )");

            db.run("CREATE TABLE IF NOT EXISTS Items (\
                itemID INTEGER PRIMARY KEY,\
                type TEXT,\
                label TEXT,\
                latitude REAL,\
                longitude REAL,\
                park INTEGER,\
                FOREIGN KEY(type) REFERENCES ItemTypes(itemTypeID),\
                FOREIGN KEY(park) REFERENCES Parks(parkID)\
            )");

            db.run("CREATE TABLE IF NOT EXISTS ItemTypes (\
                itemTypeID TEXT PRIMARY KEY,\
                description TEXT,\
                quantity INTEGER,\
                use INTEGER DEFAULT 0\
            )");

        });
    },
    CloseDb : function() {
         db.close();
    }
}

