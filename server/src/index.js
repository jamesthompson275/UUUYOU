import express from "express";
import cors from "cors";
import dbInit from "./db/dbInitialise.js";
import dbUpdate from "./db/dbUpdate.js";
import {setupRestApiGet} from "./api/controllers/controllers";

// dbInit.initialiseDb();
// dbUpdate.readParkData();
// dbUpdate.readBCCRSS();


const PORT = 3000;

const server = express();

server.use(cors());

server.get("/", (req, res) => {
    res.send("UUUYOU");
});

setupRestApiGet(server);

server.listen(PORT, () => console.log(
    `server is now running on http://localhost:${PORT}`
));
