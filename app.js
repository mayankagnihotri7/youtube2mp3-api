// required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// create the express server
const app = express();

// server port number
const PORT = process.env.PORT || 3000;

// needed to parse html data  for POST request
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/convert-mp3", async (req, res) => {
  const videoId = req.body.videoId;

  if (videoId === undefined || videoId === "" || videoId === null) {
    return res.render("index", {
      success: false,
      message: "Please enter the video ID",
    });
  } else {
    const fetchAPT = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST,
        },
      }
    );

    const fetchResponse = await fetchAPT.json();

    if (fetchResponse.status === "ok") {
      res.render("index", {
        success: true,
        song_title: fetchResponse.title,
        song_link: fetchResponse.link,
      });
    } else {
      res.render("index", { success: false, message: fetchResponse.mmsg });
    }
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
