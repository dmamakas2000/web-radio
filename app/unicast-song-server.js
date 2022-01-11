// Import Express
const express = require('express')
const app = express()
const fs = require('fs')

// Axios
const axios = require("axios");

// Http adapter
const httpAdapter = require("axios/lib/adapters/http");

// Host
const hostname = 'localhost';

// Application port
const portApp = 9090;

// var PLAYLIST = streamPlaylist['playlist_id'];

// Host static files
app.use('/app/htdocs/tracks/jingles', express.static('public'));
app.use('/app/htdocs/tracks/ads', express.static('public'));
app.use('/app/htdocs/tracks/playlist-1', express.static('public'));
app.use('/app/htdocs/tracks/playlist-2', express.static('public'));
app.use('/app/htdocs/tracks/playlist-3', express.static('public'));
app.use('/app/htdocs/tracks/playlist-4', express.static('public'));
app.use('/app/htdocs/tracks/playlist-5', express.static('public'));

// Important headers in order not to generate CORS errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

function getInput() {
  let jsonData = JSON.parse(fs.readFileSync('./htdocs/stream/stream-playlist.json', 'utf-8'))

  if (jsonData.playlist_id == 1) {
    return "http://localhost:8080/tracks/playlist-1/";
  } else if (jsonData.playlist_id == 2) {
    return "http://localhost:8080/tracks/playlist-2/";
  } else if (jsonData.playlist_id == 3) {
    return "http://localhost:8080/tracks/playlist-3/";
  } else if (jsonData.playlist_id == 4) {
    return "http://localhost:8080/tracks/playlist-4/";
  } else if (jsonData.playlist_id == 5) {
    return "http://localhost:8080/tracks/playlist-5/";
  }
}

// Songs play endpoint
app.get("/audio/:song", (req, res) => {
  const INPUT = getInput() + req.params.song;
  axios
    .get(INPUT, {
      responseType: "stream",
      adapter: httpAdapter,
      "Content-Range": "bytes 16561-8065611",
    })
    .then((Response) => {
      const stream = Response.data;

      res.set("content-type", "audio/mp3");
      res.set("accept-ranges", "bytes");
      res.set("content-length", Response.headers["content-length"]);
      console.log(Response);

      stream.on("data", (chunk) => {
        res.write(chunk);
      });

      stream.on("error", (err) => {
        res.sendStatus(404);
      });

      stream.on("end", () => {
        res.end();
      });
    })
    .catch((Err) => {
      console.log(Err.message);
      console.log(INPUT);
      // console.log(Err);
    });
});

// Jingles play endpoint
app.get("/jingles/:name", (req, res) => {
  const INPUT = "http://localhost:8080/tracks/jingles/" + req.params.name;
  axios
    .get(INPUT, {
      responseType: "stream",
      adapter: httpAdapter,
      "Content-Range": "bytes 16561-8065611",
    })
    .then((Response) => {
      const stream = Response.data;

      res.set("content-type", "audio/mp3");
      res.set("accept-ranges", "bytes");
      res.set("content-length", Response.headers["content-length"]);
      console.log(Response);

      stream.on("data", (chunk) => {
        res.write(chunk);
      });

      stream.on("error", (err) => {
        res.sendStatus(404);
      });

      stream.on("end", () => {
        res.end();
      });
    })
    .catch((Err) => {
      console.log(Err.message);
    });
});

// Ads play endpoint
app.get("/ads/:name", (req, res) => {
  const INPUT = "http://localhost:8080/tracks/ads/" + req.params.name;
  axios
    .get(INPUT, {
      responseType: "stream",
      adapter: httpAdapter,
      "Content-Range": "bytes 16561-8065611",
    })
    .then((Response) => {
      const stream = Response.data;

      res.set("content-type", "audio/mp3");
      res.set("accept-ranges", "bytes");
      res.set("content-length", Response.headers["content-length"]);
      console.log(Response);

      stream.on("data", (chunk) => {
        res.write(chunk);
      });

      stream.on("error", (err) => {
        res.sendStatus(404);
      });

      stream.on("end", () => {
        res.end();
      });
    })
    .catch((Err) => {
      console.log(Err.message);
    });
});

// Make the application listening on port 8081
app.listen(portApp, hostname, () => {
  console.log(`App running at http://${hostname}:${portApp}/`);
});