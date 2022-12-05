const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  photo: {
    type: String,
  },
  file: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  s3_file_key: {
    type: String,
  },
  s3_photo_key: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments:{
    type: [{
      id:String,
      comment:String,
      commentDate:{
        type: Date,
    default: Date.now,
      }
    }],
    default: [],

  },
  postedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("posts", PostSchema);
