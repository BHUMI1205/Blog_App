import fs from "fs";
import streamifier from "streamifier";
import { blog, user, like, saveBlog, category, Comment } from "./models.js";
import { validateBlogData, validateUpdateBlogData, validateUpdateLikeData } from "../validators/blog.js";

import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

import { blogPostData } from '../Aggregrate/blogUserPost_aggregation.js';
import { saveBlogPostData } from '../Aggregrate/saveBlogPost_aggregation.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getBlog = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const categorydata = await category.find({});
      const { startIndex, limit } = req.pagination;
      const users = await user.findById(req.user.id);
      const blogs = await blog
        .aggregate([{
          $match: {
            userId: users._id
          }
        }, ...blogPostData])
        .skip(startIndex)
        .limit(limit);

      let userData = await user.aggregate([
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
            role: "$role"
          },
        },
      ])

      return res.render("Blog/blog", {
        blogs,
        totalPages: Math.ceil(blogs.length / limit),
        page: req.pagination.page,
        user: req.user,
        limit,
        userData,
        categorydata
      });
    } else {
      return res.redirect('/')
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

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
      const { theme, title, detail, date, status } = req.body;
      const validationError = validateBlogData(title, detail);

      if (validationError) {
        req.flash("error", validationError);
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
          req.flash("error", "Blog is not Added");
          return res.redirect("back");
        } else {
          return res.redirect("/blog");
        }
      }
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
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
          let savedBlog = await saveBlog.deleteMany({ blogId: req.query.id });
          if (comment, Like, savedBlog) {
            req.flash("success", "Blog is Deleted");
            return res.redirect("back");
          } else {
            req.flash("success", "Blog is not Deleted");
            return res.redirect("back");
          }
        }
        req.flash("success", "Blog is not Deleted");
        return res.redirect("back");
      }
      else {
        req.flash("success", "Category is not Deleted from Cloudinary");
        return res.redirect("back");
      }
    } else {
      return res.redirect('/')
    }

  } catch (err) {
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
    console.log(err);
    return false;
  }
};

const blogupdate = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { id, theme, title, detail, date, status } = req.body;
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
            status: status
          });
          if (data) {
            req.flash("success", "Blog is Updated");
            return res.redirect("/blog");
          } else {
            req.flash("success", "Blog is not Updated");
            return res.redirect("back");
          }
        }
      } else {
        let data = await blog.findByIdAndUpdate(id, {
          categoryId: theme,
          detail: detail,
          title: title,
          status: status,
          date: Blogdata.date,
          image: Blogdata.image,
          public_id: Blogdata.publicIds,

        });
        if (data) {
          req.flash("success", "Blog is Updated");
          return res.redirect("/blog");
        }
        req.flash("success", "Blog is not Updated");
        return res.redirect("back");
      }
    } else {
      return res.redirect('back')
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const likes = async (req, res) => {
  try {
    const validationError = validateUpdateLikeData();
    if (req.isAuthenticated()) {
      let blogId = req.query.id;
      let userId = req.user.id;
      let existingLike = await like.findOne({ blogId, userId });
      if (existingLike) {
        req.flash("success", "You have already liked this post");
        return res.redirect("back");
      } else {
        let blogs = await blog.findById(blogId);
        if (blogs) {
          await blog.findByIdAndUpdate(blogId, { $inc: { like: 1 } });

          await like.create({ blogId, userId });

          req.flash("success", "Blog liked successfully");
          return res.redirect("back");
        } else {
          req.flash("success", "Blog not found");
          return res.redirect("back");
        }
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
    let blogId = req.query.id;
    let userId = req.user.id;
    let existingLike = await like.findOne({ blogId, userId });
    if (existingLike) {

      let blogs = await blog.findById(blogId);

      if (blogs) {
        await blog.findByIdAndUpdate(blogId, { $inc: { like: -1 } });
        await like.findOneAndDelete({ blogId, userId });

        req.flash("success", "Blog unliked successfully");
        return res.redirect("back");
      } else {
        return res.redirect("back");
      }
    } else {
      req.flash("success", "You haven't liked this post");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    req.flash("success", "An error occurred");
    return res.redirect("back");
  }
};

const save = async (req, res) => {
  try {
    const validationError = validateUpdateLikeData();
    if (req.isAuthenticated()) {
      let blogId = req.query.id;
      let blogs = await blog.findById(blogId);
      const saveblog = await saveBlog.findOne({ blogId: blogId });
      if (saveblog && saveblog.saveUserId == req.user.id) {
        req.flash("success", "Blog Already saved.");
        return res.redirect("back");
      } else {
        if (blogs) {
          if (blogs.userId == req.user.id) {
            req.flash("success", "This is Your Blog");
            return res.redirect("back");
          } else {
            const data = await saveBlog.create({
              saveUserId: req.user.id,
              blogId: blogId,
            });
            if (data) {
              req.flash("success", "Blog is Saved.");
              return res.redirect("back");
            } else {
              req.flash("success", "Blog is not Saved.");
              return res.redirect("back");
            }
          }
        } else {
          req.flash("success", "Blog is not available.");
          return res.redirect("back");
        }
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

const unsave = async (req, res) => {
  try {
    let blogId = req.query.id;
    let existingSave = await saveBlog.findOne({ blogId });
    if (existingSave) {
      let saveblog = await blog.findById(blogId);

      if (saveblog) {
        await saveBlog.findOneAndDelete({ blogId });

        req.flash("success", "Blog unSaved successfully");
        return res.redirect("back");
      } else {
        req.flash("success", "Blog is not unSaved");
        return res.redirect("back");
      }
    } else {
      req.flash("success", "You haven't unSaved this post");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const savedblogs = async (req, res) => {
  try {
    const { startIndex, limit } = req.pagination;
    const categorydata = await category.find({});

    const blogs = await blog
      .aggregate(saveBlogPostData)
      .skip(startIndex)
      .limit(limit);

    return res.render("Blog/savedblog", {
      blogs,
      user: req.user,
      totalPages: Math.ceil(blogs.length / limit),
      page: req.pagination.page,
      limit,
      categorydata
    });
  } catch (err) {
    console.log(err);
    return false;
  }
};

const comments = async (req, res) => {
  try {
    const validationError = validateUpdateLikeData();
    if (req.isAuthenticated()) {
      const { comment, blogId } = req.body;
      let data = await Comment.create({
        comment: comment,
        blogId: blogId,
        bloggerId: req.user.id,
        userId: req.user.id,
      });
      if (data) {
        await blog.findByIdAndUpdate(blogId, { $inc: { comment: 1 } });
        req.flash("success", "comment is Added");
        return res.redirect("back");
      } else {
        req.flash("success", "comment is not Added");
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

const searchData = async (req, res) => {
  try {
    const { startIndex, limit } = req.pagination;

    const categorydata = await category.find({});

    const categorySearch = await category.find({
      theme: { $regex: req.body.search },
    });

    const themes = categorySearch.map((val) => val.theme);

    let blogs = await blog.aggregate([
      ...blogPostData, {
        $match: {
          $or: [
            { theme: { $regex: req.body.search } },
            { title: { $regex: req.body.search } }
          ]
        },
      }
    ]).skip(startIndex).limit(limit);


    return res.render("AdminPanel/index", {
      categorydata,
      blogs,
      totalPages: Math.ceil(blogs.length / limit),
      page: req.pagination.page,
      user: req.user,
      themes,
      limit
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}

const DateSearchData = async (req, res) => {
  try {
    const { startIndex, limit } = req.pagination;

    const categorydata = await category.find({});

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    let blogs = await blog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      }, ...blogPostData]).skip(startIndex)
      .limit(limit);

    return res.render("AdminPanel/index", {
      categorydata,
      blogs,
      totalPages: Math.ceil(blogs.length / limit),
      page: req.pagination.page,
      user: req.user,
      themes: [],
      limit
    });
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

const getCategoryResult = async (req, res) => {
  try {
    const { startIndex, limit, page } = req.pagination;

    const categories = await category.findById(req.query.categoryId);
    const categorydata = await category.find({});
    let blogs, themes = [];

    if (categories === null) {
      req.flash('success', 'There is no Post of this Category')
      return res.redirect('back');
    } else {
      blogs = await blog.aggregate([
        {
          $match: {
            categoryId: categories._id,
          },
        }, ...blogPostData]).skip(startIndex).limit(limit);
    }

    return res.render("AdminPanel/index", {
      categorydata,
      blogs,
      totalPages: Math.ceil(blogs.length / limit),
      page: page,
      user: req.user,
      themes,
      limit
    });
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

const userPost = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const categorydata = await category.find({});

      const { startIndex, limit } = req.pagination;
      const users = await user.findById(req.query.userId);

      const blogs = await blog
        .aggregate([{
          $match: {
            userId: users._id
          }
        }, ...blogPostData])
        .skip(startIndex)
        .limit(limit);

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
        totalPages: Math.ceil(blogs.length / limit),
        page: req.pagination.page,
        user: req.user,
        limit,
        userData
      });

    } else {
      return res.redirect('/')
    }
  } catch (err) {
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
      req.flash("success", "Blog Deactivted Successfully");
      return res.redirect('back');
    }
    else {
      req.flash("success", "Blog is not Deactivted!");
      return res.redirect('back');
    }
  } catch (err) {
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
      req.flash("success", "Role Updated Successfully");
      return res.redirect('back');
    } else {
      req.flash("success", "Role is not Updated!");
      return res.redirect('back');
    }
  } catch (err) {
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
      req.flash("success", "Role Updated Successfully");
      return res.redirect('back');
    } else {
      req.flash("success", "Role is not Updated!");
      return res.redirect('back');
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

export {
  getBlog,
  blogAdd,
  blogDataAdd,
  deleteblog,
  editblog,
  blogupdate,
  likes,
  unlike,
  save,
  unsave,
  savedblogs,
  comments,
  searchData,
  DateSearchData,
  getCategoryResult,
  userPost,
  blogActive,
  blogDeactive,
  adminRole,
  userRole
};
