const user = require("../model/user");
const category = require("../model/category");
const blog = require("../model/blog");
const like = require("../model/like");
const saveBlog = require("../model/saveblog");
const Comment = require("../model/comments");
const scheduleDeletion = require("../middelwares/postdelete");

module.exports = {
  user,
  category,
  blog,
  like,
  saveBlog,
  Comment,
  scheduleDeletion
};
