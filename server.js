const request = require("request");

//////////////////////////////////////////////////////////////////////////
//DEPLOY
///////////////////////////////////////////////////////////////////////////
(async () => {
  const script = "!.glitch-deploy.js";
  if (process.env.PROJECT_DOMAIN) {
    const deployfile = ":deploying:";
    require("download")(
      "https://raw.githubusercontent.com/blubbll/glitch-deploy/master/glitch-deploy.js",
      __dirname,
      {
        filename: script
      }
    ).then(() => {
      deployProcess();
    });

    const deployProcess = async () => {
      const deploy = require(`./${script}`);
      const deployCheck = async () => {
        //console.log("🐢Checking if we can deploy...");
        if (fs.existsSync(`${__dirname}/${deployfile}`)) {
          console.log("🐢💥Deploying triggered via file.");
          fs.unlinkSync(deployfile);
          await deploy({
            ftp: {
              password: process.env.DEPLOY_PASS,
              user: process.env.DEPLOY_USER,
              host: process.env.DEPLOY_HOST
            },
            clear: 0,
            verbose: 1,
            env: 1
          });
          request(
            `https://evennode-reboot.eu-4.evennode.com/reboot/${process.env.DEPLOY_TOKEN}/${process.env.PROJECT_DOMAIN}`,
            (error, response, body) => {
              console.log(error || body);
            }
          );
          require("child_process").exec("refresh");
        } else setTimeout(deployCheck, 9999); //10s
      };
      setTimeout(deployCheck, 999); //1s
    };
    deployProcess();
  } else require(`./${script}`)({ env: true }); //apply env on deployed server
})();


// init project
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

var corsOptions = {
  origin: function(origin, callback) {
    if (origin) {
      console.log(`Origin: ${origin}`);
      if (
        [
          "https://translate.googleusercontent.com",
          "https://www.translatoruser-int.com"
        ].indexOf(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    } else callback(null, true);
  }
};

app.options("*", cors());
app.use(cors(corsOptions));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", async (req, res) => {
  res.set("content-type", "text/html;");
  const url = encodeURIComponent(`${req.protocol}://${req.hostname}${req.originalUrl}`);

  let cnt = fs.readFileSync(`${__dirname}/views/index.html`, "utf8");
  cnt = cnt.replace("{{requrl}}", url).toString("utf8");
  //res.set("content-length", cnt.length);
  res.write(cnt);
  res.end();
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});