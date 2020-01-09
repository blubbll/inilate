// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

const white = {
  romdo: "/romdo",
  modi: "/modi"
};

app.use([white.romdo, white.modi], async (req, res, next) => {
  next();
});

app.use("*", (req, res, next) => {
  if (
    [process.env.WHITE_IPS].includes(req.ip) || //direct
    [process.env.WHITE_IPS].includes(
      req.headers["x-forwarded-for"].split(",")[0]
    )
  ) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  } else return req.emit("timeout");
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  const file = `${__dirname}/views/index.html`;
  //res.sendFile(__dirname + "/views/index.html");
  if (req.query["mode"] === "notranslate")
    res.send(
      fs
        .readFileSync(file, "utf8")
        .replace(/<pre pre>/gi, `<pre pre class="notranslate">`)
    );
  else res.sendFile(file);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
