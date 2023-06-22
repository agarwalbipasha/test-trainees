const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

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
