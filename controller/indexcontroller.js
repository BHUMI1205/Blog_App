import { blog, category, user } from "./models.js";
import logger from '../logger.js';
import { blogPostData } from '../Aggregrate/blogPost_aggregation.js';
import { client } from "../helper/redis.js"

import mongoose from "mongoose";

// client.connect()
//   .then(() => {
//     console.log("Redis client connected");
//   })
//   .catch((err) => {
//     console.error("Error connecting to Redis:", err); 
//   });

const blogPosts = async (req, res) => {
  try {
    const categorydata = await category.find({});
    let blogs, cachedBlogs;
    // cachedBlogs = await client.get('blogs');
    if (cachedBlogs != null) {
      blogs = JSON.parse(cachedBlogs);
    } else {
      let id;
      if (req.isAuthenticated()) {
        id = req.user.id;
        id = new mongoose.Types.ObjectId(id);

        if (req.user.IsSubscribed == true) {
          blogs = await blog.aggregate([...blogPostData(id)]).skip(req.pagination.startIndex)
        } else {
          blogs = await blog.aggregate([{ $match: { isPremium: false }, }, ...blogPostData(id)]).skip(req.pagination.startIndex).limit(6)
        }
      } else {
        blogs = await blog.aggregate([{ $match: { isPremium: false }, }, ...blogPostData(id)]).limit(3).sort({ _id: -1 })
      }

      // await client.set('blogs', JSON.stringify(blogs));
      // const myKeyValue = await client.get('blogs');
    }

    return res.render("AdminPanel/index", {
      categorydata,
      themes: [],
      blogs,
      page: req.pagination.page,
      user: req.user,
      response: []
    });
  } catch (err) {
    logger.error(err)
    console.log(err);
    return false;
  }
};

export { blogPosts };
