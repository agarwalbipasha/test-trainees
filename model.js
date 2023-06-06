const mongoose = require("mongoose");

const validateEmail = function (email) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const traineeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
    minLength: 1,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validateEmail, "Please enter a valid email ID."],
  },
  leavesHalfDay: {
    type: [String],
    validate: {
      validator: function (value) {
        const isValid = value.every((date) => {
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          return dateRegex.test(date);
        });
        return isValid;
      },
      message: "Invalid date format",
    },
    
  },
  leavesFullDay: {
    type: [Date],
    validate: {
      validator: function (value) {
        const isValid = value.every((date) => {
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          return dateRegex.test(date);
        });
        return isValid;
      },
      message: "Invalid date format",
    },
  },
});

const Trainee = mongoose.model("Trainee", traineeSchema);

module.exports = Trainee;
