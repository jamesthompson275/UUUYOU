import sqlite from 'sqlite3';

module.exports = {

    setupRestApiGet : function(app) {

        // get sent a lat, long, send all items near it
        app.get('/parkItems', function(req, res) {
            var lat = req.body.lat;
            var long = req.body.long;

            var items = findAllNearbyItems(lat, long);
            res.send(JSON.stringify(items));
        });
    }
}

function findAllNearbyItems(lat, long) {

    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items WHERE latitude BETWEEN ${lat-0.02} AND ${lat+0.02} AND longitude BETWEEN ${long-0.02} AND ${long+0.02}`, function(err, rows) {
        return rows;
    });
    db.close();
}