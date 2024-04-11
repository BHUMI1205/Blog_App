import { blog, like, followBlogger, Comment } from "../controller/models.js";
import * as cron from 'node-cron';

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cron.schedule('05 0 * * *', () => {
  scheduleDeletion
})

const scheduleDeletion = async () => {

  let post = await blog.aggregate([
    {
      $match: {
        postDeleteDate: { $lte: new Date() }
      }
    }
  ]);
  if (post != false) {
    for (let i = 0; i < post.length; i++) {
      try {
        let imageFile = await blog.findById(post[i]._id);
        if (imageFile) {
          let data = await blog.findByIdAndDelete(post[i]._id);
          if (data) {
            let publicId = imageFile.public_id;
            for (let i = 0; i < publicId.length; i++) {
              cloudinary.uploader.destroy(publicId[i]);
            }
            let comment = await Comment.deleteMany({ blogId: post[i]._id });
            let Like = await like.deleteMany({ blogId: post[i]._id });
            let savedBlog = await followBlogger.deleteMany({ blogId: post[i]._id });
            if (comment, Like, savedBlog) {
              console.log("Blog is Deleted");
              return res.redirect("back");
            } else {
              console.log("Blog is Deleted");
              return res.redirect("back");
            }
          }
        }
      }
      catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  }
}


export { scheduleDeletion };