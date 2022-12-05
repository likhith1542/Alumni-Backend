const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema(
  {
    name: {
      type: Array,
    },
  },
);

module.exports = mongoose.model("Chapter", ChapterSchema);
