const mongoose = require("mongoose");
const moment = require("moment");

const dateValidator = {
    validator: function (date) {
      return moment(date, "DD-MM-YYYY", true).isValid();
    },
    message: "Invalid date format",
  };

  function toDateValidator(value, context) {
    if (value && context.fromDate) {
      return value >= context.fromDate;
    }
    return true;
  }

const validateEmail = {
  validator: function (email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },
  message: "Please enter a valid email ID.",
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
    // get: (value) => moment(value).format("DD MMMM YYYY"),
    // set: (value) => moment(value, "DD MMMM YYYY").toDate(),
    validate: [dateValidator],
  },
  toDate: {
    type: Date,
    required: true,
    trim: true,
    // get: (value) => moment(value).format("DD MMMM YYYY"),
    // set: (value) => moment(value, "DD MMMM YYYY").toDate(),
    validate: {
    validator: function (value) {
      return moment(value, "DD MMMM YYYY", true).isValid() && value >= this.fromDate;
    },
    message: "ToDate should not be before FromDate."
  },
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

leaveSchema.set("toJSON", { 
  getters: true,
  transform: function (doc, ret, options) {
    ret.fromDate = moment(ret.fromDate).format("DD MMMM YYYY");
    ret.toDate = moment(ret.toDate).format("DD MMMM YYYY");
    return ret;
  }
 });

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
  leave: [leaveSchema]
  
});

traineeSchema.pre("save", async function (next) {
  const trainee = this;
  // const Model = mongoose.model("Trainee", traineeSchema);

  try {
    const model = mongoose.model("Trainee");
    const idCount = await model.countDocuments({ id: trainee.id });
    if (idCount > 0) {
      throw new Error("Trainee with the same id already exists");
    }

    const emailCount = await model.countDocuments({ email: trainee.email});
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
