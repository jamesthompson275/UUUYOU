import express from "express";
import cors from "cors";

const PORT = 4000;

const server = express();

server.use("*", cors({ origin: `http://localhost:${PORT}` }));

server.listen(PORT, () => console.log(
    `server is now running on http://localhost:${PORT}`
));
