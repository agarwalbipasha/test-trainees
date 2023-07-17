require('dotenv').config();

const express = require("express");
const app = express();
const morgan = require('morgan');
const fs = require("fs");
const path = require('path');
const port = process.env.PORT;

app.use(express.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
 
app.use(morgan('combined', { stream: accessLogStream }));

const db = require("./src/models");

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the database!");
}).catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
});

require("./src/routes/trainee.routes")(app);

app.listen(port, () => {
  console.log("Server connected successfully");
});
// logging using morgan, winston - done using morgan
// environment variables - done
// async await - optional
// validation of req body using joi or yup
// Deployment - render, fly, railway
// Error handling in nodejs processess - optional - uncaught exception, unhandled rejection

// Redis
// Mongo
// NodeJS Express
// 