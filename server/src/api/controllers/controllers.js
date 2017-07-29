import sqlite from 'sqlite3';

module.exports = {

    setupRestApiGet : function(app) {

        // get sent a lat, long, send all items near it
        app.get('/parkItems', function(req, res) {
            let lat = +req.query.lat;
            let lng = +req.query.lng;
            let thresh = +req.query.thresh || 0.05;

            findAndReturnAllNearbyItems(lat, lng, thresh, res);
        });
    }
}

function findAllNearbyItems(lat, lng, thresh, res) {
    
    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items WHERE latitude BETWEEN ${lat-thresh} AND ${lat+thresh} AND longitude BETWEEN ${lng-thresh} AND ${lng+thresh}`, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
}