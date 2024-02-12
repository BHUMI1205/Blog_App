const mongoose = require("mongoose");

const commentschema = mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bloggerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  comment: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true
  });

const comment = mongoose.model("comment", commentschema);

module.exports = comment;
