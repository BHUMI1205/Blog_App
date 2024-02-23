import mongoose from "mongoose";

const likeschema = mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
},
  {
    timestamps: true
  });

const like = mongoose.model("like", likeschema);

export { like };
