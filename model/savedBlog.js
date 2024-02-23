import mongoose from "mongoose";

const savedBlogSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
},
  {
    timestamps: true
  });

const savedBlog = mongoose.model("savedBlog", savedBlogSchema);

export {savedBlog};