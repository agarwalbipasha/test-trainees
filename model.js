const mongoose = require("mongoose");
const moment = require("moment");

const validateEmail = {
  validator: function (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },
  message: "Please enter a valid email ID.",
};

const dateValidator = {
  validator: function (dates) {
    return dates.every((date) => moment(date, "DD-MM-YYYY", true).isValid());
  },
  message: "Invalid date format",
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
  leavesHalfDay: {
    type: [String],
    validate: [dateValidator],
  },
  leavesFullDay: {
    type: [String],
    validate: [dateValidator],
  },
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
