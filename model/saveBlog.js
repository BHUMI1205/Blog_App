const mongoose = require("mongoose");

const saveblogschema = mongoose.Schema({
  saveUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
    required: true,
  },
},
  {
    timestamps: true
  });

const Saveblog = mongoose.model("saveblog", saveblogschema);

module.exports = Saveblog;
