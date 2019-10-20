var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();
var cors = require('cors');
const assert = require('assert');
const password = require('./password');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = `mongodb+srv://hoijof:${password}@stacker-hfsff.mongodb.net/test?retryWrites=true&w=majority`;

// Database Name
const dbName = 'Stacker';
let db;

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);
  const stacker = db.collection('stacker');

  app.locals.stacker = stacker;
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

process.on('SIGINT', () => {
  db.close();
  process.exit();
});