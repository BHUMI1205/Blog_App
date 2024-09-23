import fs from "fs";
import streamifier from "streamifier";
import { blog, user, like, followBlogger, savedBlog, category, Comment, subscription } from "./models.js";
import { paypal } from "../config/paypal.js";
import * as cron from 'node-cron';
import { mongoose } from 'mongoose';

import { validateBlogData, validateUpdateBlogData, validateData } from "../validators/blog.js";
import logger from '../logger.js';

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
})

import { blogPostData } from '../Aggregrate/blogPost_aggregation.js';
import { saveBlogPostData } from '../Aggregrate/savedBlogPost_aggregation.js';

cron.schedule('05 0 * * *', () => {
   // logMessage();
   unsubscribe
})

function logMessage() {
   console.log('Cron job executed at:', new Date().toLocaleString());
}

const getBlog = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let userData;
         const categorydata = await category.find({});
         const users = await user.findById(req.user.id);
         const blogs = await blog.aggregate([{ $match: { userId: users._id } }, ...blogPostData(req.user.id)]).skip(req.pagination.startIndex)

         if (req.user.role == 'superAdmin') {
            // super-admin blog view
            userData = await user.aggregate([
               {
                  $match: {
                     role: { $nin: ["superAdmin"] }
                  }
               },
               {
                  $lookup: {
                     from: "blogs",
                     localField: "_id",
                     foreignField: "userId",
                     as: "userBlogs",
                  },
               },
               {
                  $project: {
                     _id: "$_id",
                     username: "$username",
                     blogId: "$userBlogs._id",
                     follower: "$follower",
                     following: "$following",
                     role: "$role"
                  },
               },
            ])
         }

         return res.render("Blog/blog", {
            blogs,
            page: req.pagination.page,
            user: req.user,
            userData,
            categorydata
         });
      } else {
         return res.redirect('/')
      }
   } catch (err) {
      console.log(err);
      logger.error(err);
      return false;
   }
};

const singleBlogPost = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let blogId = req.query.blogId;
         blogId = new mongoose.Types.ObjectId(blogId);

         const blogs = await blog.aggregate([{ $match: { _id: blogId } }, ...blogPostData(req.user.id)])

         const categorydata = await category.find({});

         return res.render('blog/singleBlog', {
            blogs,
            user: req.user,
            categorydata
         })
      } else {
         req.flash('success', 'You have to login first to read the blog')
         return res.redirect('/')
      }
   } catch (err) {
      console.log(err);
      logger.error(err);
      return false;
   }
}

const blogAdd = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let data = await category.find({});
         return res.render("Blog/blogAdd", {
            data,
            user: req.user,
            categorydata: data
         });
      } else {
         req.flash("success", "You have to Login First to Add Blog");
         return res.redirect('/');
      }
   } catch (err) {
      console.log(err);
      return false;
   }
};

const blogDataAdd = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let file = req.files;
         const { theme, title, detail, date, status } = req.body;
         const validationError = validateBlogData(title, detail, theme, file);

         if (validationError) {
            req.flash("success", validationError);
            return res.redirect("back");
         } else {

            const uploadPromises = req.files.map(file => {
               return new Promise((resolve, reject) => {
                  const uploadStream = cloudinary.uploader.upload_stream({
                     public_id: Date.now() + Math.floor(Math.random() * 1000000),
                     resource_type: "image",
                     folder: "blogs/image"
                  }, (err, result) => {
                     if (err) {
                        logger.warning("Error uploading image to Cloudinary");
                        reject(err);
                     } else {
                        console.log(result.url);
                        resolve(result);
                     }
                  });
                  streamifier.createReadStream(file.buffer).pipe(uploadStream);
               });
            });

            const uploadResults = await Promise.all(uploadPromises);

            const imageUrls = [];
            const publicIds = [];

            uploadResults.forEach(result => {
               if (result.url && result.public_id) {
                  imageUrls.push(result.url);
                  publicIds.push(result.public_id);
               }
            });

            const data = await blog.create({
               categoryId: theme,
               title: title,
               detail: detail,
               image: imageUrls,
               public_id: publicIds,
               userId: req.user.id,
               postDeleteDate: date,
               status: status
            });

            if (!data) {
               logger.warning("Blog is not Added");
               req.flash("error", "Blog is not Added");

               return res.redirect("back");
            } else {
               return res.redirect("/blog");
            }
         }
      }
      else {
         console.log("ok");
         return res.redirect('/')
      }
   } catch (err) {
      console.log(err);
      logger.error(err);
      req.flash("error", "An error occurred");
      return res.redirect('/');
   }
};

const deleteblog = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let imageFile = await blog.findById(req.query.id);
         if (imageFile) {
            let data = await blog.findByIdAndDelete(req.query.id);
            if (data) {
               let publicId = imageFile.public_id;
               for (let i = 0; i < publicId.length; i++) {
                  cloudinary.uploader.destroy(publicId[i]);
               }
               let comment = await Comment.deleteMany({ blogId: req.query.id });
               let Like = await like.deleteMany({ blogId: req.query.id });
               let savedBlog = await followBlogger.deleteMany({ blogId: req.query.id });
               if (comment, Like, savedBlog) {
                  logger.info("Blog is Deleted")
                  req.flash("success", "Blog is Deleted");
                  return res.redirect("back");
               } else {
                  logger.warning("Blog is not Deleted")
                  req.flash("success", "Blog is not Deleted");
                  return res.redirect("back");
               }
            }
            logger.warning("Blog is not Deleted")
            req.flash("success", "Blog is not Deleted");
            return res.redirect("back");
         }
         else {
            logger.warning("Category is not Deleted from Cloudinary")
            req.flash("success", "Category is not Deleted from Cloudinary");
            return res.redirect("back");
         }
      } else {
         return res.redirect('/')
      }

   } catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
};

const editblog = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let categories = await category.find({});
         let blogs = await blog.findById(req.query.id).populate("categoryId");
         return res.render("Blog/editblog", {
            blog: blogs,
            category: categories,
            user: req.user,
            categorydata: categories
         });
      } else {
         return res.redirect('back');
      }
   } catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
};

const blogupdate = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let { id, theme, title, detail, date, status, premium } = req.body;
         if (date != false) {
            date = new Date(date)
         }
         let Blogdata = await blog.findById(id);
         const validationError = validateUpdateBlogData(title, detail);

         if (validationError) {
            req.flash("success", validationError);
            return res.redirect("back");
         } else if (req.files && req.files.length > 0) {
            if (req.files.length > 4) {
               req.flash("success", "You can only add 4 images");
               return res.redirect("back");
            } else {
               let publicId = Blogdata.public_id;
               for (let i = 0; i < publicId.length; i++) {
                  cloudinary.uploader.destroy(publicId[i]);
               }

               const uploadPromises = req.files.map(file => {
                  return new Promise((resolve, reject) => {
                     const uploadStream = cloudinary.uploader.upload_stream({
                        public_id: Date.now() + Math.floor(Math.random() * 1000000),
                        resource_type: "image",
                        folder: "blogs/image"
                     }, (err, result) => {
                        if (err) {
                           reject(err);
                        } else {
                           resolve(result);
                        }
                     });

                     streamifier.createReadStream(file.buffer).pipe(uploadStream);
                  });
               });

               const uploadResults = await Promise.all(uploadPromises);

               const imageUrls = [];
               const publicIds = [];

               uploadResults.forEach(result => {
                  if (result.url && result.public_id) {
                     imageUrls.push(result.url);
                     publicIds.push(result.public_id);
                  }
               });

               let data = await blog.findByIdAndUpdate(id, {
                  categoryId: theme,
                  detail: detail,
                  title: title,
                  image: imageUrls,
                  public_id: publicIds,
                  postDeleteDate: date,
                  isPremium: premium,
                  status: status
               });
               if (data) {
                  logger.info("Blog is Updated");
                  req.flash("success", "Blog is Updated");
                  return res.redirect("/blog");
               } else {
                  logger.warning("Blog is not Updated");
                  req.flash("success", "Blog is not Updated");
                  return res.redirect("back");
               }
            }
         } else {
            let data = await blog.findByIdAndUpdate(id, {
               categoryId: theme,
               detail: detail,
               title: title,
               isPremium: premium,
               status: status,
               postDeleteDate: date,
               image: Blogdata.image,
               public_id: Blogdata.publicIds,
            });
            if (data) {
               logger.info("Blog is Updated");
               req.flash("success", "Blog is Updated");
               return res.redirect("/blog");
            } else {
               logger.warning("Blog is not Updated");
               req.flash("success", "Blog is not Updated");
               return res.redirect("back");
            }
         }
      } else {
         return res.redirect('back')
      }
   } catch (err) {
      console.log(err);
      logger.error(err);
      return false;
   }
};

const blogger = async (req, res) => {
   try {
      const categorydata = await category.find({});
      const username = await user.findById(req.query.bloggerId);

      const { startIndex } = req.pagination;
      let blogs, IsSubscribed, id;

      if (req.isAuthenticated()) {
         id = req.user.id;
         id = new mongoose.Types.ObjectId(id);

         if (req.user.IsSubscribed == true) {
            blogs = await blog.aggregate([{ $match: { userId: username._id }, }, ...blogPostData(id)]).skip(startIndex)
         } else {
         } blogs = await blog.aggregate([{ $match: { isPremium: false, userId: username._id }, }, ...blogPostData(id)]).skip(startIndex)

      } else {
         blogs = await blog
            .aggregate([{
               $match: {
                  userId: username._id
               }
            }, ...blogPostData(id)])
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
      console.log(err);
      logger.error(err);
      return false;
   }
};

const likes = async (req, res) => {
   try {
      const validationError = validateData();
      if (req.isAuthenticated()) {
         let blogId = req.query.id;
         let userId = req.user.id;
         let blogs = await blog.findById(blogId);
         if (blogs) {
            if (blogs.userId == userId) {
               logger.info("This is your Blog");
               req.flash("success", "This is your Blog");
               return res.redirect("back");
            } else {
               await blog.findByIdAndUpdate(blogId, { $inc: { like: 1 } });
               await like.create({ blogId, userId });

               logger.info("Blog liked successfully");
               req.flash("success", "Blog liked successfully");
               return res.redirect("back");
            }
         } else {
            logger.warning("Blog not found");
            req.flash("success", "Blog not found");
            return res.redirect("back");
         }
      } else {
         req.flash("success", validationError);
         return res.redirect("back");
      }
   } catch (err) {
      console.log(err);
      return false;
   }
};

const unlike = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let blogId = req.query.id;
         let userId = req.user.id;
         let existingLike = await like.findOne({ blogId, userId });
         if (existingLike) {

            let blogs = await blog.findById(blogId);

            if (blogs) {
               await blog.findByIdAndUpdate(blogId, { $inc: { like: -1 } });
               await like.findOneAndDelete({ blogId, userId });

               logger.info("Blog unliked successfully")
               req.flash("success", "Blog unliked successfully");
               return res.redirect("back");
            } else {
               return res.redirect("back");
            }
         } else {
            logger.warning("You haven't liked this post")
            req.flash("success", "You haven't liked this post");
            return res.redirect("back");
         }
      }
      else {
         return res.redirect('/')
      }
   } catch (err) {
      logger.error(err)
      console.log(err);
      return res.redirect("back");
   }
};

const follow = async (req, res) => {
   try {
      const validationError = validateData();
      if (req.isAuthenticated()) {
         let bloggerId = req.query.id;
         let followerId = req.user.id;
         await user.findByIdAndUpdate(bloggerId, { $inc: { follower: 1 } });
         await user.findByIdAndUpdate(followerId, { $inc: { following: 1 } });

         let data = await followBlogger.create({ bloggerId, followerId });

         if (data) {
            logger.info("Blog is followed");
            req.flash("success", "Blog is followed.");
            return res.redirect("back");
         } else {
            logger.warning("Blog is not followed");
            req.flash("success", "Blog is not followed.");
            return res.redirect("back");
         }
      } else {
         req.flash("success", validationError);
         return res.redirect("back");
      }
   } catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
};

const unfollow = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let bloggerId = req.query.id;
         let followerId = req.user.id
         let existingSave = await followBlogger.findOne({ bloggerId, followerId });
         if (existingSave) {

            let followBloggers = await user.findById(bloggerId);

            if (followBloggers) {
               await user.findByIdAndUpdate(bloggerId, { $inc: { follower: -1 } });
               await user.findByIdAndUpdate(followerId, { $inc: { following: -1 } });
               await followBlogger.findOneAndDelete({ bloggerId, followerId });

               logger.info("Blog unfollow successfully")
               req.flash("success", "Blog unfollow successfully");
               return res.redirect("back");
            } else {
               logger.warning("Blog is not unfollow")
               req.flash("success", "Blog is not unfollow");
               return res.redirect("back");
            }
         } else {
            logger.warning("You haven't unfollow this post")
            req.flash("success", "You haven't unfollow this post");
            return res.redirect("back");
         }
      } else {
         return res.redirect('/')
      }
   } catch (err) {
      logger.error(err)
      console.log(err);
      return false;
   }
};

const save = async (req, res) => {
   try {
      const validationError = validateData();
      if (req.isAuthenticated()) {

         let blogId = req.query.id;
         let blogs = await blog.findById(blogId);
         if (blogs) {
            if (blogs.userId == req.user.id) {
               req.flash("success", "This is Your Blog");
               return res.redirect("back");
            } else {
               const data = await savedBlog.create({
                  userId: req.user.id,
                  blogId: blogId,
               });
               if (data) {
                  logger.info("Blog is Saved");
                  req.flash("success", "Blog is Saved.");
                  return res.redirect("back");
               } else {
                  logger.warning("Blog is not Saved");
                  req.flash("success", "Blog is not Saved.");
                  return res.redirect("back");
               }
            }
         } else {
            logger.warning("Blog is not found");
            req.flash("success", "Blog is not found.");
            return res.redirect("back");
         }
      } else {
         req.flash("success", validationError);
         return res.redirect("back");
      }
   } catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
};

const unsave = async (req, res) => {
   try {
      let blogId = req.query.id;
      let existingSave = await savedBlog.findOne({ blogId });
      if (existingSave) {
         let savedBlogs = await blog.findById(blogId);

         if (savedBlogs) {
            await savedBlog.findOneAndDelete({ blogId });

            logger.info("Blog unSaved successfully")
            req.flash("success", "Blog unSaved successfully");
            return res.redirect("back");
         } else {
            logger.warning("Blog is not unSaved")
            req.flash("success", "Blog is not unSaved");
            return res.redirect("back");
         }
      } else {
         logger.warning("You haven't Saved this post")
         req.flash("success", "You haven't Saved this post");
         return res.redirect("back");
      }
   } catch (err) {
      logger.error(err)
      console.log(err);
      return false;
   }
};

const savedblogs = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         const categorydata = await category.find({});

         const blogs = await savedBlog
            .aggregate(saveBlogPostData)
            .skip(req.pagination.startIndex)

         return res.render("Blog/savedblog", {
            blogs,
            user: req.user,
            page: req.pagination.page,
            categorydata
         });
      }
      else {
         req.flash("success", "You have to Login First to save Blog");
         return res.redirect('/');
      }
   } catch (err) {
      logger.error(err)
      console.log(err);
      return false;
   }
};

const comments = async (req, res) => {
   try {
      const validationError = validateData();
      if (req.isAuthenticated()) {
         const { comment, blogId } = req.body;
         let data = await Comment.create({
            comment: comment,
            blogId: blogId,
            userId: req.user.id,
         });
         if (data) {
            await blog.findByIdAndUpdate(blogId, { $inc: { comment: 1 } });
            logger.info("comment is Added");
            req.flash("success", "comment is Added");
            return res.redirect("back");
         } else {
            logger.warning("comment is not Added");
            req.flash("success", "comment is not Added");
            return res.redirect("back");
         }
      } else {
         req.flash("success", validationError);
         return res.redirect("back");
      }
   } catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
};

const searchData = async (req, res) => {
   try {
      const categorydata = await category.find({});

      const categorySearch = await category.find({
         theme: { $regex: req.body.search },
      });

      const themes = categorySearch.map((val) => val.theme);
      let blogs, id;

      if (req.isAuthenticated()) {
         let id = new mongoose.Types.ObjectId(req.user.id);
         if (req.user.IsSubscribed == true) {
            blogs = await blog.aggregate([{
               $match: {
                  $or: [
                     { theme: { $regex: req.body.search, $options: 'i' } },
                     { title: { $regex: req.body.search, $options: 'i' } }
                  ]
               },
            }, ...blogPostData(id)]).skip(req.pagination.startIndex)
         } else {
            blogs = await blog.aggregate([{
               $match: {
                  isPremium: false,
                  $or: [
                     { theme: { $regex: req.body.search, $options: 'i' } },
                     { title: { $regex: req.body.search, $options: 'i' } }
                  ], 
               },
               ...blogPostData(id).skip(req.pagination.startIndex).sort({ _id: -1 }).limit(6)
            }])
         }
      }
      else {
         blogs = await blog.aggregate([
            {
               $match: {
                  isPremium: false,
                  $or: [
                     { theme: { $regex: req.body.search, $options: 'i' } },
                     { title: { $regex: req.body.search, $options: 'i' } }
                  ]
               },
            }, ...blogPostData(id)
         ]).sort({ _id: -1 }).limit(3)
      }
      console.log("🚀 ~ searchData ~ blogs:", blogs)

      if (blogs != false) {
         return res.render("AdminPanel/index", {
            categorydata,
            blogs,
            page: req.pagination.page,
            user: req.user,
            themes,
            response: []
         });
      } else {
         logger.warning("There is no Post of this Category")
         req.flash('success', 'There is no Post of this Category')
         return res.redirect('/');
      }
   }
   catch (err) {
      logger.log(err);
      return res.status(500).send("Internal Server Error");
   }
}

const dateSearchData = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         const categorydata = await category.find({});

         const startDate = new Date(req.body.startDate);
         const endDate = new Date(req.body.endDate);

         let blogs;
         let id = new mongoose.Types.ObjectId(req.user.id);

         if (req.user.IsSubscribed == true) {
            blogs = await blog.aggregate([{
               $match: {
                  createdAt: { $gte: startDate, $lte: endDate }
               },
            }, ...blogPostData(id)]).skip(req.pagination.startIndex)
         } else {
            blogs = await blog.aggregate([{
               $match: {
                  isPremium: false, createdAt: { $gte: startDate, $lte: endDate }
               },
            }, ...blogPostData(id)]).skip(req.pagination.startIndex).sort({ _id: -1 }).limit(6)
         }

         return res.render("AdminPanel/index", {
            categorydata,
            blogs,
            page: req.pagination.page,
            user: req.user,
            themes: [],
            response: []
         });
      }
      else {
         return res.redirect('/')
      }
   }
   catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
}

const getCategoryResult = async (req, res) => {
   try {
      const categories = await category.findById(req.query.categoryId);
      let blogData = await blog.find({ categoryId: req.query.categoryId });
      const categorydata = await category.find({});
      let blogs, id;

      if (blogData == false) {
         logger.warning("There is no Post of this Category")
         req.flash('success', 'There is no Post of this Category')
         return res.redirect('back');
      } else {
         if (req.isAuthenticated()) {
            let id = req.query.id

            if (req.user.IsSubscribed == true) {
               blogs = await blog.aggregate([{
                  $match: {
                     categoryId: categories._id,
                  },
               }, ...blogPostData(id)]).skip(req.pagination.startIndex)
            } else {
               blogs = await blog.aggregate([{
                  $match: {
                     isPremium: false, categoryId: categories._id,
                  },
               }, ...blogPostData(id)]).skip(req.pagination.startIndex).limit(6)
            }
         } else {
            blogs = await blog.aggregate([
               {
                  $match: {
                     isPremium: false,
                     categoryId: categories._id,
                  },
               }, ...blogPostData(id)]).sort({ _id: -1 }).limit(3)
         }
      }

      return res.render("AdminPanel/index", {
         categorydata,
         blogs,
         page: req.pagination.page,
         user: req.user,
         themes: [],
         response: []
      });
   }
   catch (err) {
      logger.error(err);
      console.log(err);
      return false;
   }
}

const userPost = async (req, res) => {
   try {
      if (req.isAuthenticated()) {
         let id = new mongoose.Types.ObjectId(req.user.id);
         const categorydata = await category.find({});

         const users = await user.findById(req.query.userId);

         let blogs;
         if (req.user.IsSubscribed == true) {
            blogs = await blog.aggregate([{
               $match: {
                  userId: users._id
               },
            }, ...blogPostData(id)]).skip(req.pagination.startIndex).limit(6)
         } else {
            blogs = await blog.aggregate([{
               $match: {
                  isPremium: false, userId: users._id
               },
            }, ...blogPostData(id)]).skip(req.pagination.startIndex)
         }

         let userData = await user.aggregate([
            {
               $match: {
                  role: "user"
               }
            },
            {
               $lookup: {
                  from: "blogs",
                  localField: "_id",
                  foreignField: "userId",
                  as: "userBlogs",
               },
            },
            {
               $project: {
                  _id: "$_id",
                  username: "$username",
                  blogId: "$userBlogs._id",
               },
            },
         ])

         return res.render("AdminPanel/index", {
            categorydata,
            themes: [],
            blogs,
            page: req.pagination.page,
            user: req.user,
            userData,
            response: []
         });

      } else {
         return res.redirect('/')
      }
   } catch (err) {
      logger.error(err)
      console.log(err);
      return false;
   }
};

const blogActive = async (req, res) => {
   try {
      let id = req.query.id;
      let blogUpdate = await blog.findByIdAndUpdate(id, {
         status: 1
      });
      if (blogUpdate) {
         req.flash("success", "Blog Activted Successfully");
         return res.redirect('back');
      } else {
         req.flash("success", "Blog is not Activted!");
         return res.redirect('back');
      }
   } catch (err) {
      logger.log(err)
      console.log(err);
      return false;
   }
}

const blogDeactive = async (req, res) => {
   try {
      let id = req.query.id;
      let blogUpdate = await blog.findByIdAndUpdate(id, {
         status: 0
      });
      if (blogUpdate) {
         logger.info("Blog Deactivted Successfully")
         req.flash("success", "Blog Deactivted Successfully");
         return res.redirect('back');
      }
      else {
         logger.warning("Blog is not Deactivted!")
         req.flash("success", "Blog is not Deactivted!");
         return res.redirect('back');
      }
   } catch (err) {
      logger.log(err)
      console.log(err);
      return false;
   }

}

const adminRole = async (req, res) => {
   try {
      let id = req.query.id;
      let blogUpdate = await user.findByIdAndUpdate(id, {
         role: 'admin'
      });
      if (blogUpdate) {
         logger.info("Role Updated Successfully")
         req.flash("success", "Role Updated Successfully");
         return res.redirect('back');
      } else {
         logger.warning("Role is not Updated!")
         req.flash("success", "Role is not Updated!");
         return res.redirect('back');
      }
   } catch (err) {
      logger.log(err)
      console.log(err);
      return false;
   }
}

const userRole = async (req, res) => {
   try {
      let id = req.query.id;
      let blogUpdate = await user.findByIdAndUpdate(id, {
         role: 'user'
      });
      if (blogUpdate) {
         logger.info("Role Updated Successfully")
         req.flash("success", "Role Updated Successfully");
         return res.redirect('back');
      } else {
         logger.warning("Role is not Updated!")
         req.flash("success", "Role is not Updated!");
         return res.redirect('back');
      }
   } catch (err) {
      logger.log(err)
      console.log(err);
      return false;
   }
}

const payment = (req, res) => {
   return res.render('subscription/priceTable')
}

const paypalPaymentBasic = async (req, res) => {
   try {

      const filter = { _id: new mongoose.Types.ObjectId(req.user.id) };
      const updateDocument = {
         $set: {
            SubscriptionPlan: "free"
         },
      };
      const result = await user.updateOne(filter, updateDocument);

      return res.redirect('/')
   }

   catch (err) {
      console.log(err);
      return false;
   }
}

const paypalPaymentPro = async (req, res) => {
   try {
      let userId = req.user.id
      const paymentData = {
         "intent": "SALE",
         "payer": {
            "payment_method": "paypal"
         },
         "redirect_urls": {
            "return_url": `https://blogs-0chr.onrender.com/paypalsuccess?userId=${userId}&subscriptionPlan=pro`,
            "cancel_url": "https://blogs-0chr.onrender.com/paypalcancel"
         },
         "transactions": [{
            "amount": {
               "currency": "USD",
               "total": "49"
            },
            "description": "Payment using PayPal"
         }]
      };

      paypal.payment.create(paymentData, (err, payment) => {
         if (err) {
            console.log(err.response);
            return res.status(500).send("Error creating PayPal payment");
         } else {
            for (let i = 0; i < payment.links.length; i++) {
               if (payment.links[i].rel === "approval_url") {
                  return res.redirect(payment.links[i].href);
               }
            }
            return res.status(500).send("Approval URL not found in PayPal response");
         }
      });
   } catch (err) {
      console.log(err);
      return res.status(500).send("Error creating PayPal payment");
   }
}

const paypalPaymentEnterprise = async (req, res) => {
   try {
      let userId = req.user.id
      const paymentData = {
         "intent": "SALE",
         "payer": {
            "payment_method": "paypal"
         },
         "redirect_urls": {
            "return_url": `https://blogs-0chr.onrender.com/paypalsuccess?userId=${userId}&subscriptionPlan=enterprise`,
            "cancel_url": "https://blogs-0chr.onrender.com/paypalcancel"
         },
         "transactions": [{
            "amount": {
               "currency": "USD",
               "total": "69"
            },
            "description": "Payment using PayPal"
         }]
      };

      paypal.payment.create(paymentData, (err, payment) => {
         if (err) {
            console.log(err.response);
            return res.status(500).send("Error creating PayPal payment");
         } else {
            for (let i = 0; i < payment.links.length; i++) {
               if (payment.links[i].rel === "approval_url") {
                  return res.redirect(payment.links[i].href);
               }
            }
            return res.status(500).send("Approval URL not found in PayPal response");
         }
      });
   } catch (error) {
      console.error('Error creating PayPal payment:', error);
      return res.status(500).send('Error creating PayPal payment');
   }
}

const paypalsuccess = async (req, res) => {
   try {
      let dt = new Date();
      let subscriptionEnd = new Date(dt.setMonth(dt.getMonth() + 1));

      await subscription.create({
         subscriptionPlan: req.query.subscriptionPlan,
         token: req.query.token,
         transactionId: req.query.paymentId,
         payerId: req.query.PayerID,
         userId: req.query.userId,
         IspaymentPending: false,
         subscriptionEnd: subscriptionEnd
      })


      let data = await subscription.find({}).sort({ _id: -1 }).limit(1);

      let userId = req.query.userId
      userId = new mongoose.Types.ObjectId(userId)

      await user.findOneAndUpdate({ _id: userId }, { '$set': { 'subscriptionId': data[0]._id, IsSubscribed: true } });

      req.flash("success", "transaction completed")
      return res.redirect('/')
   }
   catch (error) {
      console.error('Error handling PayPal success:', error);
      req.flash("error", "Error handling PayPal success");
      return res.redirect('/');
   }
}

const paypalcancel = async (req, res) => {
   req.flash("success", "transaction canceled")
   return res.redirect('/')
}

const unsubscribe = async (req, res) => {
   try {

      let userId;

      let subscription = await subscription.deleteMany({ subscriptionEnd: { $lt: new Date() } })
      if (subscription) {
         subscription.map((val) => {
            user.findByIdAndUpdate(val.userId, { '$unset': { subscriptionId: "" } });
            user.findOneAndUpdate({ _id: val.userId }, { '$set': { IsSubscribed: false } });
         })
      }
      if (req.isAuthenticated()) {
         userId = req.user.id;

         await user.findByIdAndUpdate(userId, { '$unset': { subscriptionId: "" } });
         await user.findOneAndUpdate({ _id: userId }, { '$set': { IsSubscribed: false } });
         await subscription.findOneAndDelete({ userId: userId })

         return res.redirect('back')
      }

   } catch (err) {
      console.log(err);
      return false
   }
}

export {
   getBlog,
   singleBlogPost,
   blogAdd,
   blogDataAdd,
   deleteblog,
   editblog,
   blogupdate,
   blogger,
   likes,
   unlike,
   save,
   unsave,
   follow,
   unfollow,
   savedblogs,
   comments,
   searchData,
   dateSearchData,
   getCategoryResult,
   userPost,
   blogActive,
   blogDeactive,
   adminRole,
   userRole,
   payment,
   paypalPaymentBasic,
   paypalPaymentPro,
   paypalPaymentEnterprise,
   paypalsuccess,
   paypalcancel,
   unsubscribe
};
