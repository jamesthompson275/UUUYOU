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
                addParkItemTypeDataToTable(data, db);
            })
        });

        request("https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, {ignoreEmpty: true, headers: true, trim: true});
            readStream.on("data", function(data) {
                addParkDataToTable(data,db);
            });
        });

        // Run through the parks data again now that parks have been created in the db to get each item
        request("https://www.data.brisbane.qld.gov.au/data/dataset/39cb83b5-111e-47fb-ae21-6b141cd16f25/resource/66b3c6ce-4731-4b19-bddd-8736e3111f7e/download/Open-Data---AM---datasetparkfacilties.csv", (err, res) => {
            if (err) throw new Error(err);
            const readStream = csv.fromString(res.body, {ignoreEmpty: true, headers: true, trim: true});
            readStream.on("data", function(data) {
                addParkItemDataToTable(data,db);
            });
        });
    }
}

function addParkItemTypeDataToTable(data, db) {

    let sql = 'INSERT OR IGNORE INTO ItemTypes VALUES (?,?,?,?)';
    let dataString = `(${data["ITEM TYPE"]},${data["DESCRIPTION"]},${data["QTY"]},0)`;

    db.run(sql, dataString, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function addParkDataToTable(data, db) {

    let sql = 'INSERT OR IGNORE INTO Parks VALUES (?,?)';
    let dataString = `(${data["PR_NO"]},${data["PARK_NAME"]})`;
    
    db.run(sql, dataString, function(err) {
        if (err) {
            throw new Error(err);
        }
    });
}

function addParkItemDataToTable(data, db) {

    let sql = 'INSERT OR IGNORE INTO Items VALUES (?,?,?,?,?,?)';
    let dataString = `(${data["ITEM_ID"]},${data["ITEM_TYPE"]},${data["DESCRIPTION"].replace(/,/g, '')},${data["LATITUDE"]},${data["LONGITUDE"]},${data["PR_NO"]})`;

    db.run(sql, dataString, function(err) {
        if (err) {
            throw new Error(err);
        }
    });
}