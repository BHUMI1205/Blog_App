import mongoose from "mongoose";

const followBloggerSchema = mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bloggerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
},
  {
    timestamps: true
  });

const followBlogger = mongoose.model("followBlogger", followBloggerSchema);

export {followBlogger};