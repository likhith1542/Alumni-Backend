const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  postedOn: {
    type: Date,
    default: Date.now,
  },
  message:{
    type:String,
    required:true
  },
  postedBy:{
    type:String,
    required:true,
  }
});

module.exports = Notification = mongoose.model("notifications", NotificationSchema);
