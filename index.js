const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Trainee = require("./models/trainee");
const port = 3000;

app.use(express.json());

mongoose.connect(
  `mongodb+srv://agarwalbipasha:vWOj28rB7YHK1ojM@cluster0.td1hcft.mongodb.net/`
);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Successfully connected to Mongoose");
});

app.get("/", async (req, res) => {
  const allTrainees = await Trainee.find({});
  try {
    res.json(allTrainees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/trainees", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const conditions = {};
    if (searchQuery) {
      conditions.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }
    const trainees = await Trainee.find(conditions);

    res.json(trainees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/", async (req, res) => {
  const newTrainee = new Trainee({
    name: req.body.name,
    id: req.body.id,
    email: req.body.email,
    leave: req.body.leave,
  });
  try {
    const data = await newTrainee.save();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Trainee.findByIdAndDelete(id);
    res.send(`Deleted ${data}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const updatedTrainee = {
    name: req.body.name,
    id: req.body.id,
    email: req.body.email,
    leave: req.body,leave
  };

  
  try {
    const result = await Trainee.findByIdAndUpdate(id, updatedTrainee);
    res.json(`Data updated successfully: ${result}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log("Server connected successfully");
});
