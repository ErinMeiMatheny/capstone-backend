//Things to install: npm init, express, sequelize, pg, pg-hstore, body-parser, cors (--save is not required with npm install these days)
//sequelize init (this adds the models and migrations and stuff)
//sequelize model:create --name order_history --attributes title:string
//^^That makes the models and creates the migrations that sequelize needs. Make one for each table.

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const cors = require("cors");
app.use(cors());


// const expressSession = require("express-session");
// const SessionStore = require("express-session-sequelize")(expressSession.Store);

const cookieParser = require("cookie-parser");
const Sequelize = require("sequelize");

app.use(cookieParser());

//firebase Authenication Middleware
const admin = require('firebase-admin');
const serviceAccount = require("./firebase-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jobtracker-29739.firebaseio.com"
});

async function firebaseAuthMiddleware(req,res,next) {
  

  if(req.headers?.authorization?.startsWith("Bearer ")){
    const idToken = req.headers.authorization.split("Bearer ")[1]
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      req["userId"] = decodedToken.uid

    } catch (error) {
      res.status(403).send(error)
    }
  } else {
    res.status(403).send("user must be logged in")
  } 
  next()
}

app.use(firebaseAuthMiddleware)


const myDatabase = new Sequelize(

  {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    password: "null"

  }
);

// const myDatabase = new Sequelize("postgres://user:localhost/8000/e-commerce");

// const sequelizeSessionStore = new SessionStore({
//   db: myDatabase,
// });

// app.use(
//   expressSession({
//     secret: process.env.SECRET_KEY || "dev",
//     store: sequelizeSessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 60000 },
//   })
// );

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Pulls from our models so we can reference is with 'db'
const db = require("./models");

//Pulls in routes to use for sequelize
const apiRoutes = require("./routes/apiRoutes");
app.use("/", apiRoutes);

//DB Connection
require("./models/index");

//
db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}.`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);

  });

