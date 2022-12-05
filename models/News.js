const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema=new Schema({
    name: {
        type: String,
        required: true
      },
      image:{
          type:String,
          required:true
      },
      
      message: {
        type: String,
      },
      postedOn:{
          type:Date,
          default:Date.now
      },
      s3_key:{
        type:String,
        required:true
      }
})

module.exports = News = mongoose.model("news", NewsSchema);
