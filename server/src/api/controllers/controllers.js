import sqlite from 'sqlite3';

module.exports = {

    setupRestApiGet : function(app) {

        // get sent a lat, long, send all items near it
        app.get('/parkItems', function(req, res) {
            var lat = req.query.lat;
            var lng = req.query.lng;

            var items = findAllNearbyItems(lat, lng);
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