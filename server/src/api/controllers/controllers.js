import sqlite from 'sqlite3';

module.exports = {

    setupRestApiGet : function(app) {

        // get sent a lat, long, send all items near it
        app.get('/parkItems', function(req, res) {
            var lat = +req.query.lat;
            var lng = +req.query.lng;

            var items = findAllNearbyItems(lat, lng, res);
        });
    }
}

function findAllNearbyItems(lat, lng, res) {
    
    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items WHERE latitude BETWEEN ${lat-0.05} AND ${lat+0.05} AND longitude BETWEEN ${lng-0.05} AND ${lng+0.05}`, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
}