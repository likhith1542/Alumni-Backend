const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required:true
  },
  type:{
    type: String,
    required:true
  },
  postedOn: {
    type: Date,
    default: Date.now,
  },
  s3_key:{
    type:String,
    required:true
  }
});

module.exports = Gallery = mongoose.model("galleries", GallerySchema);
