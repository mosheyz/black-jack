import express from "express";
import "dotenv/config";
import { router } from "./routers/router.js";
import { errorHandler, logger } from "./routers/middleware.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json(), logger, router, errorHandler);


app.get("/", (req, res) => {
    console.log("hi")
    res.send("hi");
});


app.listen(PORT || 3000, () => console.log("server listening on port 3000"));
