const mongoose = require("mongoose");
const Leave = require("./leave");

const validateEmail = {
  validator: function (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },
  message: "Please enter a valid email ID.",
};

const traineeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
    min: 1,
    message: "ID should be a valid number."
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z ]+$/,
    message: "Please provide a valid name",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validateEmail],
  },
  leave: [Leave]
});

traineeSchema.pre("save", async function (next) {
  const trainee = this;
  const Model = mongoose.model("Trainee", traineeSchema);

  try {
    const idCount = await Model.countDocuments({ id: trainee.id });
    if (idCount > 0) {
      throw new Error("Trainee with the same id already exists");
    }

    const emailCount = await Model.countDocuments({ email: trainee.email});
    if (emailCount > 0) {
      throw new Error("Trainee with the same email already exists")
    }
    next();
  } catch (error) {
    next(error);
  }
})

const Trainee = mongoose.model("Trainee", traineeSchema);

module.exports = Trainee;
