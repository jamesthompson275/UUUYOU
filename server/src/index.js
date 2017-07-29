import express from "express";
import cors from "cors";
import dbInit from "./db/dbInitialise.js";
import dbUpdate from "./db/dbUpdate.js";
import api from "./api/controllers/controllers.js";

dbInit.initialiseDb();
dbUpdate.readParkData();

const PORT = 3000;

const server = express();

server.use("*", cors({ origin: `http://localhost:${PORT}` }));

server.get("/", (req, res) => {
    res.send("UUUYOU");
});

api.setupRestApiGet(server);

server.listen(PORT, () => console.log(
    `server is now running on http://localhost:${PORT}`
));
