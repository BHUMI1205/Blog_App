import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userschema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  follower: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  IsSubscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscription",
  },
  role: {
    type: String,
    enum: ["superAdmin", "admin", "user"],
    default: "user",
  }
},
  {
    timestamps: true
  });

userschema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();

});

const user = mongoose.model("user", userschema); 

export { user };
