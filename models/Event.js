const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema=new Schema({
    name: {
        type: String,
        required: true
      },
      image:{
          type:String,
          required:true
      },
      date: {
        type: Date,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      topic: {
        type: String,
        required:true
      },
      postedOn:{
          type:Date,
          default:Date.now
      },
      s3_key:{
        type:String,
        required:true
      },type:{
        type: String,
        required:true
      },
})

module.exports = Event = mongoose.model("events", EventSchema);
