const mongoose = require("mongoose");

const validateEmail = function(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};
  

const traineeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        trim: true,
        minLength: 1
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validateEmail, "Please enter a valid email ID."]
    }
});

const Trainee = mongoose.model("Trainee", traineeSchema);

module.exports = Trainee;