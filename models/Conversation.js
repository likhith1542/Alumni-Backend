const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    postedOn: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model("Conversation", ConversationSchema);
