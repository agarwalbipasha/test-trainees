const mongoose = require("mongoose");
const moment = require("moment");

const dateValidator = {
    validator: function (dates) {
      return dates.every((date) => moment(date, "DD-MM-YYYY", true).isValid());
    },
    message: "Invalid date format",
  };
  
  const leaveSchema = new mongoose.Schema({
    id: {
      type: Number,
      required: true,
      trim: true,
      min: 1,
      message: "ID should be a valid number."
    },
    fromDate: {
      type: Date,
      required: true,
      trim: true,
      validate: [dateValidator],
      message: "Date should be a valid date."
    },
    toDate: {
      type: Date,
      required: true,
      trim: true,
      validate: [dateValidator],
      message: "Date should be a valid date."
    },
    type: {
      type: String,
      required: true,
      trim: true,
      message: "Type can be either full day/half day."
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        message: "Reason cannot be empty."
      }
  });

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = "Leave";

  
  