import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  public_id: {
    type: Array,
    required: true
  },
  detail: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  like: {
    type: Number,
    default: 0,
  },
  comment: {
    type: Number,
    default: 0,
  },
  postDeleteDate: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  });

const blog = mongoose.model("blog", blogSchema);

export { blog };