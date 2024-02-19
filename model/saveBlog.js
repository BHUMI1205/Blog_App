import mongoose from "mongoose";

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

const saveBlog = mongoose.model("saveblog", saveblogschema);

export {saveBlog};
