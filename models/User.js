const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isA: {
    type: String,
    required:true,
    default:'No'
  },
  designation: {
    type: String,
    default:'N/A'
  },
  chapterCountry: {
    type: String,
  },
  chapterCity: {
    type: String,
  },
  id: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  requests:{
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  DOB:{
    type:String,
    required:true,
    default:'01-01-2000'
  },
  dept:{
    type:String,
    default:'N/A'
  },
  prgrm:{
    type:String,
    default:'N/A'
  },
  year:{
    type:String,
    default:'N/A'
  },
  avatar: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
  }
});
module.exports = User = mongoose.model("users", UserSchema);
