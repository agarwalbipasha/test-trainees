const db = require("../models");
const Trainee = require("../models/trainee");

exports.create = (req, res) => {
    const newTrainee = new Trainee({
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      leave: req.body.leave,
    });
    newTrainee.save()
    .then(data => {
        res.send (data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating the Trainee."
        });
    }); 
};

exports.findAll = async (req, res) => {
    Trainee.find().then(data => res.send(data))
    .catch(err => res.status(500).send({ 
        message: err.message || "Some error occured while retrieving trainees."}))
  };

exports.findOne = (req, res) => {
      const searchQuery = req.query.search;
      const conditions = {};
      if (searchQuery) {
        conditions.$or = [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ];
    }
    Trainee.findOne(conditions)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({ message: err.message })
        }})
    .catch(err => res.status(500).send({
        message: err.message || "Some error occurred while retrieving the trainees."
    }))
  };

exports.delete = (req, res) => {
    const id = req.params.id;
  Trainee.findByIdAndDelete(id)
  .then(data => res.send(`Deleted ${data}`))
  .catch(err => res.status(500).send({
    message: err.message || 
    "Some error occured while deleting the trainee with id."
  }));
};

exports.update = (req, res) => {
    const id = req.params.id;
    const updatedTrainee = {
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      };
  
  Trainee.findByIdAndUpdate(id, updatedTrainee)
  .then(data => res.status(200).send(`Data updated successfully: ${data}`))
  .catch(err => 
    res.status(500).json({ 
        message: 
        err.message || "Some error occured while updating the trainee."}));
    };

module.exports = exports;
