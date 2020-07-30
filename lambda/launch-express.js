const express = require("express");

const PORT = 3000;
const app = express();

app.get("/a", (req, res) => {
    res.send("This is test A, Successful GET");
});

app.post("/b", (req, res) => {
    res.send("This is test B, Successful POST");
});

app.get("/c", (req, res) => {
    res.status(403).send("This is test C, Failed GET");
});

app.post("/d", (req, res) => {
    res.status(409).send("This is test D, Failed POST");
});



app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
