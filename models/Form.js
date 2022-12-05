const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FormSchema = new Schema({
    name  : {
    type: String,
    required: true,
  },
  id:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message:{
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
  }
});

module.exports = Form = mongoose.model("forms", FormSchema);
