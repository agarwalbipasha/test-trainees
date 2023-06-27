const dbConfig = process.env.URL;

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig;
db.trainees = require("./trainee")(mongoose);

module.exports = db;