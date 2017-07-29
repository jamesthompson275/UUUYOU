import fs from 'fs';
import csv from 'fast-csv';
import request from "request";
import sqlite from 'sqlite3';

module.exports = {
    
    readParkData : function() {
        let db = new sqlite.Database('UUUYou.db');

        request("https://www.data.brisbane.qld.gov.au/data/dataset/8738f735-c60c-4f2f-86b3-0c0a58e5357c/resource/3c4730f8-5b79-4612-bdfe-144ead0de6ea/download/Open-Data---AM---datasetparksassetdatacountofparkitems.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, {ignoreEmpty: true, headers: true, trim: true});
            readStream.on("data", function(data) {
                addParkItemTypeData(data, db);
            })
        });

        request("https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, {ignoreEmpty: true, headers: true, trim: true});
            readStream.on("data", function(data) {
                addParkData(data,db);
            });
        });

        // Run through the parks data again now that parks have been created in the db to get each item
        request("https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, {ignoreEmpty: true, headers: true, trim: true});
            readStream.on("data", function(data) {
                addParkItemData(data,db);
            });
        });

        request("https://www.data.brisbane.qld.gov.au/data/dataset/706724ed-ca3a-494a-a92e-2def5a58478b/resource/08107e61-5960-4b3c-a9c9-468d6d295020/download/BrisbaneCityCouncilEventsVenueLocations20170530.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, {ignoreEmpty: true, headers: true, trim: true});
            readStream.on("data", function(data) {
                addVenueData(data,db);
            });
        });
    }
}

function addParkItemTypeData(data, db) {

    let sql = 'INSERT OR IGNORE INTO ItemTypes VALUES ';
    sql += `("${data["ITEM TYPE"]}","${data["DESCRIPTION"]}","${data["QTY"]}",0)`;

    db.run(sql, function(err) {
        if (err) {
            throw new Error(err);
        }
    });
}

function addParkData(data, db) {

    let sql = 'INSERT OR IGNORE INTO Parks VALUES ';
    sql += `("${data["PR_NO"]}","${data["PARK_NAME"]}")`;
    
    db.run(sql, function(err) {
        if (err) {
            throw new Error(err);
        }
    });
}

function addParkItemData(data, db) {

    let sql = 'INSERT OR IGNORE INTO Items VALUES ';
    sql += `("${data["ITEM_ID"]}","${data["ITEM_TYPE"]}","${data["DESCRIPTION"].replace(/,/g, '')}",${data["LATITUDE"]},${data["LONGITUDE"]},"${data["PR_NO"]}")`;

    db.run(sql, function(err) {
        if (err) {
            throw new Error(err);
        }
    });
}

function addVenueData(data, db) {

    let sql = 'INSERT OR IGNORE INTO Venues VALUES ';
    sql += `("${data["Venue Name"]}","${data["Venue type"]}","${data["Address"].replace(/,/g, ' ')}",${data["Latitude"]},${data["Longitude"]})`;

    db.run(sql, function(err) {
        if (err) {
            throw new Error(err);
        }
    });    
}