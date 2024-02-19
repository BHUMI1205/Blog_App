import mongoose from "mongoose";

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

const Comment = mongoose.model("comment", commentschema);

export { Comment };
