import fs from 'fs';
import csv from 'fast-csv';
import request from "request";
import sqlite from 'sqlite3';
import htmlparser from "htmlparser";
import async from "async";

const feeds = [
    "http://www.trumba.com/calendars/brisbane-city-council.rss",
    "http://www.trumba.com/calendars/events-in-brisbane.rss",
    "http://www.trumba.com/calendars/active-parks.rss",
    "http://www.trumba.com/calendars/brisbane-botanic-gardens.rss?filterview=Botanic%20Gardens",
    "http://www.trumba.com/calendars/brisbane-powerhouse.rss",
    "http://www.trumba.com/calendars/BiB.rss",
    "http://www.trumba.com/calendars/chill-out.rss",
    "http://www.trumba.com/calendars/city-hall.rss?filterview=city-hall",
    "http://www.trumba.com/calendars/gold.rss",
    "http://www.trumba.com/calendars/green-events.rss?filterview=green_events",
    "http://www.trumba.com/calendars/libraries.rss",
    "http://www.trumba.com/calendars/mobile-library.rss",
    "http://www.trumba.com/calendars/LIVE.rss",
    "http://www.trumba.com/calendars/mob.rss",
    "http://www.trumba.com/calendars/planetarium.rss",
    "http://www.trumba.com/calendars/brisbanes-calendar-venues-calendar.rss?filterview=Valley%20Malls",
    "http://www.trumba.com/calendars/visble-ink.rss?filterview=vis_ink_valley"
];

const readBCCRSS = function () {
    let output = [];
    let urlcount = 0;
    const parserHandler = new htmlparser.DefaultHandler(function (err, dom) {

        if (err) {
            throw new Error(err);
        }
        var cut_dom = dom.filter(x => x.raw.trim())[1];
        cut_dom = cut_dom.children.filter(x => x.raw.trim())[0];
        cut_dom = cut_dom.children.filter(x => x.raw.trim());
        cut_dom = cut_dom.filter(x => x.raw == 'item');
        for (let i = 0; i < cut_dom.length; i++) {
            let eventInfo = {
                "title": "",
                "description": "",
                "cost": "",
                "timeStart": "",
                "timeStop": "",
                "venue": "",
                "venueAddress": "",
                "eventImage": "",
                "bookings": "",
                "category": "",
                "weblink": "",
                "age": "",
                "meetingPoint": "",
                "requirements": "",
                "showType": "",
                "schedule": "",
            };
            let event_details = cut_dom[i].children.filter(x => x.raw.trim());
            for (let item of event_details) {
                if (item["raw"] == "title") {
                    eventInfo["title"] = (item.children[0]["raw"]);
                } else if (item["raw"] == "xCal:description") {
                    eventInfo["description"] = (item.children[0]["raw"]);
                } else if (item["raw"].indexOf("x-trumba:localstart") === 0) {
                    eventInfo["timeStart"] = (item.children[0]["raw"]);
                } else if (item["raw"].indexOf("x-trumba:localend") === 0) {
                    eventInfo["timeStop"] = (item.children[0]["raw"]);
                } else if (item["raw"] == "x-trumba:weblink") {
                    eventInfo["weblink"] = (item.children[0]["raw"]);
                } else if (item["raw"] == "x-trumba:categorycalendar") {
                    let cat = item.children[0]["raw"].split("|");
                    if (cat.length > 1) {
                        eventInfo["category"] = cat[1];
                    } else {
                        eventInfo["category"] = cat[0];
                    }
                } else if (item["raw"].indexOf("x-trumba:customfield") === 0) {
                    if (item["attribs"]["name"] == "Age") {
                        eventInfo["age"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Event image") {
                        eventInfo["eventImage"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Cost") {
                        eventInfo["cost"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Bookings") {
                        eventInfo["bookings"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Meeting point") {
                        eventInfo["meetingPoint"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Requirements") {
                        eventInfo["requirements"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Venue") {
                        eventInfo["venue"] = (item.children[0]["raw"].split(",")[0])
                    } else if (item["attribs"]["name"] == "Venue address") {
                        eventInfo["venueAddress"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Show type") {
                        eventInfo["showType"] = (item.children[0]["raw"])
                    } else if (item["attribs"]["name"] == "Schedule") {
                        eventInfo["schedule"] = (item.children[0]["raw"])
                    }
                }
            }
            if (eventInfo["venue"] == "" || eventInfo["timeStart"] == "") {
                continue;
            } else {
                output.push(eventInfo)

            }
        }
    });
    const parser = new htmlparser.Parser(parserHandler);
    const bodies = []
    async.whilst(function () { return urlcount < feeds.length; },
        function (callback) {
            let url = feeds[urlcount];
            request(url, function (err, res) {
                if (err) {
                    console.log(url)
                    throw new Error(err);
                }
                bodies.push(res.body);
                urlcount++;
                console.log(urlcount);
                callback(null, urlcount);
            });
        },
        function (err) {
            console.log("Done RSS Requests");
            for (var rawHtml of bodies) {
                parser.parseComplete(rawHtml);
                console.log(output.length);
            }
            const db = new sqlite.Database('UUUYou.db');
            for (let eventInfo of output) {

                addEventInfoData(eventInfo, db);

            }
            db.close();
            console.log("Events Added");
        });
};


module.exports = {

    readParkData: function () {


        request("https://www.data.brisbane.qld.gov.au/data/dataset/8738f735-c60c-4f2f-86b3-0c0a58e5357c/resource/3c4730f8-5b79-4612-bdfe-144ead0de6ea/download/Open-Data---AM---datasetparksassetdatacountofparkitems.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, { ignoreEmpty: true, headers: true, trim: true });
            let db = new sqlite.Database('UUUYou.db');
            readStream.on("data", function (data) {
                addParkItemTypeData(data, db);
            });
            readStream.on("end", function (data) {
                db.close();
            });
        });

        request("https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, { ignoreEmpty: true, headers: true, trim: true });
            let db = new sqlite.Database('UUUYou.db');
            readStream.on("data", function (data) {
                addParkData(data, db);
            });
            readStream.on("end", function (data) {
                db.close();
            });
        });

        // Run through the parks data again now that parks have been created in the db to get each item
        request("https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, { ignoreEmpty: true, headers: true, trim: true });
            let db = new sqlite.Database('UUUYou.db');
            readStream.on("data", function (data) {
                addParkItemData(data, db);
            });
            readStream.on("end", function (data) {
                db.close();
            });
        });

        request("https://www.data.brisbane.qld.gov.au/data/dataset/706724ed-ca3a-494a-a92e-2def5a58478b/resource/08107e61-5960-4b3c-a9c9-468d6d295020/download/BrisbaneCityCouncilEventsVenueLocations20170530.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, { ignoreEmpty: true, headers: true, trim: true });
            let db = new sqlite.Database('UUUYou.db');
            readStream.on("data", function (data) {
                addVenueData(data, db);
            });
            readStream.on("end", function (data) {
                db.close();
            });
        });
    },
    readBCCRSS,
}

function addParkItemTypeData(data, db) {

    let stmt = db.prepare('INSERT OR IGNORE INTO ItemTypes VALUES (?,?,?,?)');
    Object.keys(data).forEach(x => {
        data[x] = data[x].replace(/["']/g, "");
    });
    stmt.run(`${data["ITEM TYPE"]}`, `${data["DESCRIPTION"]}`, `${data["QTY"]}`, 0);
    stmt.finalize();
}

function addParkData(data, db) {

    let stmt = db.prepare('INSERT OR IGNORE INTO Parks VALUES (?,?)');
    Object.keys(data).forEach(x => {
        data[x] = data[x].replace(/["']/g, "");
    });
    stmt.run(`${data["PR_NO"]}`, `${data["PARK_NAME"]}`);
    stmt.finalize();
}

function addParkItemData(data, db) {

    let stmt = db.prepare('INSERT OR IGNORE INTO Items VALUES (?,?,?,?,?,?)');
    Object.keys(data).forEach(x => {
        data[x] = data[x].replace(/["']/g, "");
    });
    stmt.run(`(${data["ITEM_ID"]}`, `${data["ITEM_TYPE"]}`, `${data["DESCRIPTION"].replace(/,/g, '')}`, `${data["LATITUDE"]}`,
        `${data["LONGITUDE"]}`, `${data["PR_NO"]}`);
    stmt.finalize();
}

function addVenueData(data, db) {

    let stmt = db.prepare('INSERT OR IGNORE INTO Venues VALUES (?,?,?,?,?)');
    Object.keys(data).forEach(x => {
        data[x] = data[x].replace(/["']/g, "");
    });
    stmt.run(`${data["Venue Name"]}`, `${data["Venue type"]}`, `${data["Address"].replace(/,/g, ' ')}`, `${data["Latitude"]}`, `${data["Longitude"]}`);
    stmt.finalize();
}

function addEventInfoData(data, db) {

    let stmt = db.prepare('INSERT OR IGNORE INTO EventInfo VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    Object.keys(data).forEach(x => {
        data[x] = data[x].replace(/["']/g, "");
    });
    stmt.run(`${data["title"]}`, `${data["description"]}`, `${data["cost"]}`, `${data["timeStart"]}`, `${data["timeStop"]}`,
        `${data["venue"]}`, `${data["venueAddress"]}`, `${data["eventImage"]}`, `${data["bookings"]}`, `${data["category"]}`,
        `${data["weblink"]}`, `${data["age"]}`, `${data["meetingPoint"]}`, `${data["requirements"]}`, `${data["showType"]}`, `${data["schedule"]}`);
    stmt.finalize();

}