import { blog } from "../model/blog.js";
import { saveBlog } from "../model/saveblog.js";
import { like } from "../model/like.js";
import { Comment } from "../model/comments.js";

import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scheduleDeletion = async (post) => {
  for (let i = 0; i < post.length; i++) {
    const jobDate = new Date(post[i].postDeleteDate);
    const now = new Date();
    // If the expiration date is in the future, calculate the delay
    const delayMilliseconds = jobDate > now ? jobDate - now : 0;
    // Delay before scheduling the job
    await delay(delayMilliseconds);
    // Schedule the job after the delay
    try {
      if (jobDate != "") {
        if (post[i].postDeleteDate != '') {
          let imageFile = await blog.findById(post[i].id);
          if (imageFile) {
            let data = await blog.findByIdAndDelete(post[i].id);
            if (data) {
              let publicId = imageFile.public_id;
              for (let i = 0; i < publicId.length; i++) {
                cloudinary.uploader.destroy(publicId[i]);
              }
              let comment = await Comment.deleteMany({ blogId: post[i].id });
              let Like = await like.deleteMany({ blogId: post[i].id });
              let savedBlog = await saveBlog.deleteMany({ blogId: post[i].id });
              if (comment, Like, savedBlog) {
                console.log("Blog is Deleted");
                req.flash("success", "Blog is Deleted");
                return res.redirect("back");
              } else {
                req.flash("success", "Blog is not Deleted");
                return res.redirect("back");
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
}

export { scheduleDeletion };