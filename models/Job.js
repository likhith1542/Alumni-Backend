const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true,
    
  },
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  postedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Job", JobSchema);
