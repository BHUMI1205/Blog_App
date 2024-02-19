import mongoose from "mongoose";

const likeschema = mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog", 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
},
{
  timestamps: true
});

const like = mongoose.model("like", likeschema);

export {like};
