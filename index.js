const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    const videoPath = "Mugiwaras.mp4";
    const videoSize = fs.statSync("Mugiwaras.mp4").size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLenght = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Lenght": contentLenght,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    console.log(headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(8000, () => {
    console.log("Listening on port 8000!");
    console.log("OPEN IN http://localhost:8000");
});
