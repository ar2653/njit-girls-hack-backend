require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authenticationRouter = require('./routes/auth');
const appointmentRouter = require('./routes/appointment');
const planetsRouter = require('./routes/planets');

const port = process.env.PORT || 4000;
const username = process.env.MONGOUSERNAME;
const password = process.env.MONGOPASSWORD;


// Allow cross origin requests from frontend application
app.use(cors());

// Logger for all the api calls
app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} ${req.path}`);
  next();
});

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/auth', authenticationRouter);
app.use('/appointment', appointmentRouter);
app.use('/planets', planetsRouter);

// Sample end points
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});
app.get("/name", (req, res, next) => {
  res.send("Welcome to Knowhere!!!");
});

// connect to mongodb
const uri = `mongodb+srv://${username}:${password}@cluster0.e1j46i3.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to MongoDB");
});


/**
 * Always place the 404 handler at the bottom of all the middlewares
 */
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Space server is listening on port ${port}`);
});
