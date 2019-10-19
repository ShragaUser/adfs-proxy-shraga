const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const connectMongo = require("connect-mongo");
const session = require("express-session");
const compression = require("compression");
const helmet = require("helmet");
const logger = require("morgan");
const dotenv = require("dotenv");
const configurePassport = require("./passport");
const auth = require("./routes/auth");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

dotenv.config();

const app = express();

const MongoStore = connectMongo(session);

async function initApp() {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  const db = client.db(process.env.MONGODB_NAME);
  configurePassport(db);

  app.get("/isAlive", (req, res, next) => {
    res.send("alive");
  });
  app.get("/metadata.xml", (req, res, next) => {
    res.sendFile(
      path.resolve(
        process.env.METADATA_FILE || "/usr/src/app/src/assets/metadata.xml"
      )
    );
  });
  
  app.use(express.static('docs'));
  app.use(helmet());
  app.use(cors());
  app.use(logger("tiny"));
  app.use(compression());
  app.use(cookieParser());
  app.use(
    express.json({
      limit: "100mb"
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "100mb"
    })
  );

  // Persist session in mongoDB
  app.use(
    session({
      store: new MongoStore({
        db
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/", indexRouter);
  app.use("/auth", auth);
}

initApp();

module.exports = app;
