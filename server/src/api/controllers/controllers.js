import sqlite from 'sqlite3';

module.exports = {

    setupRestApiGet : function(app) {

        app.get('/nearbyItems', function(req, res) {
            let lat = +req.query.lat;
            let lng = +req.query.lng;
            let thresh = +req.query.thresh || 0.05;

            findAndReturnAllNearbyItems(lat, lng, thresh, res);
        });

        app.get('/parkItems', function(req, res) {
            let parkID = req.query.id;

            findAndReturnSingleParkAllItems(parkID, res);
        });

        app.get('/events', function(req, res) {
            let daysForward = +req.query.daysForward;

            findAndReturnAllEventsForDays(daysForward, res);
        })

        app.get('/randomItemToReview', function(req, res) {
            let itemID = req.query.id;
            let positive = req.query.positive;
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
    db.close();
}

function findAndReturnSingleRandomItem(res) {

    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items ORDER BY RANDOM() LIMIT 1`, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
}

function findAndReturnAllNearbyItems(lat, lng, thresh, res) {
    
    var db = new sqlite.Database('UUUYou.db');
    var stuffToSend = [];

    db.all(`SELECT * FROM Items INNER JOIN Parks ON Parks.parkID = Items.park WHERE Items.latitude BETWEEN ${lat-thresh} AND ${lat+thresh} AND Items.longitude BETWEEN ${lng-thresh} AND ${lng+thresh}`, function(err, rows) {
        stuffToSend.push(rows);
    });

    db.all(`SELECT * FROM EventInfo INNER JOIN Venues ON Venues.venueID = EventInfo.venue WHERE Venues.latitude BETWEEN ${lat-thresh} AND ${lat+thresh} AND Venues.longitude BETWEEN ${lng-thresh} AND ${lng+thresh}`, function(err, rows) {
        stuffToSend.push(rows);
    });
function n() {
	if (stuffToSend.length != 2) {
		setTimeout(n, 500);
	} else {
		res.send(JSON.stringify((stuffToSend[0] || []).concat(stuffToSend[1])));
	}
}
	n();
    db.close();
}

function findAndReturnSingleParkAllItems(parkID, res) {

    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM Items WHERE park = ${parkID}`, function(err, rows) {
        res.send(JSON.stringify(rows));
    });
    db.close();
}

function findAndReturnAllEventsForDays(daysForward, res) {

    var db = new sqlite.Database('UUUYou.db');
    db.all(`SELECT * FROM EventInfo WHERE timeStart BETWEEN (SELECT date('now')) AND (SELECT date('now','+${daysForward} day'));`, function(err, rows) {
        res.send(JSON.stringify(rows));
    })
    db.close();
}
