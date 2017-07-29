import sqlite from 'sqlite3';

module.exports = {

    setupRestApiGet : function(app) {

        // get sent a lat, long, send all items near it
        app.get('/nearbyItems', function(req, res) {
            let lat = +req.query.lat;
            let lng = +req.query.lng;
            let thresh = +req.query.thresh || 0.05;

            findAndReturnAllNearbyItems(lat, lng, thresh, res);
        });

        app.get('/parkItems', function(req, res) {
            let parkID = req.query.id;

            findAndReturnSingleAllPark(parkID, res);
        });

        app.get('/randomItemToReview', function(req, res) {
            findAndReturnSingleRandomItem(res);
        });

        app.post('/randomItemToReview', function(req, res) {
            let itemID = req.body.id;
            let positive = req.body.positive;

            saveReview(itemID, positive, res);
        });
    }
}

function saveReview(itemID, positive, res) {

    var db = new sqlite.Database('UUUYou.db');
    
    let sql = `INSERT OR IGNORE INTO Reviews (item, positive) VALUES (${itemID},${positive})`;

    db.run(sql, function(err) {
        if (err) {
            res.sendStatus(400);
        }
    });
    res.sendStatus(201);
}

function findAndReturnSingleRandomItem(res) {

    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items ORDER BY RANDOM() LIMIT 1`, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
}

function findAllNearbyItems(lat, lng, thresh, res) {
    
    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items WHERE latitude BETWEEN ${lat-thresh} AND ${lat+thresh} AND longitude BETWEEN ${lng-thresh} AND ${lng+thresh}`, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
}

function findAndReturnSingleParkAllItems(parkID, res) {

    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items WHERE park = ${parkID}`, function(err, rows) {
        res.send(JSON.stringify(rows))
    });
    db.close();
}