import express from "express";
import "dotenv/config";

const PORT = process.env.PORT;
console.log(PORT)

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    console.log("hi")
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.listen(PORT || 3000, () => console.log("server listening on port 3000"));
