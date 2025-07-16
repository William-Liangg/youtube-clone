import express from "express";
import Ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json()); // to parse JSON request bodies

// app.get('/', (req, res) => {
//   res.send('Video processing service is running!');
// });

app.post("/process-video", (req, res) => {
    // get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // error handling
    if (!inputFilePath || !outputFilePath) {
        return res.status(400).send("Bad Request: Missing file path.");
    }

    Ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // convert to 360p
        .on("end", () => {
            console.log(`Processing finished: ${outputFilePath}`);
            return res.status(200).send("Processing finished successfully");
        })
        .on("error", (err) => {
            console.error(`An error occurred: ${err.message}`);
            return res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Video processing service listening at http://localhost:${port}`);
});

