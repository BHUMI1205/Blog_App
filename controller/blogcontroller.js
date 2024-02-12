const {
  blog,
  user,
  like,
  saveBlog,
  category,
  Comment,
} = require("./controller");
const { validateBlogData, validateUpdateBlogData, validateUpdateLikeData } = require("../validators/blog");
const blogPostData = require('../Aggregrate/blogUserPost_aggregation');
const saveBlogPostData = require('../Aggregrate/saveBlogPost_aggregation');

const fs = require("fs");
const Saveblog = require("../model/saveblog");

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
            role:"$role"
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
      let imageLength = req.files.length;
      const validationError = validateBlogData(title, detail, imageLength);

      if (validationError) {
        req.flash("success", validationError);
        return res.redirect("back");
      } else {
        let data = await blog.create({
          categoryId: theme,
          title: title,
          detail: detail,
          image: req.files.map((file) => file.path),
          userId: req.user.id,
          postDeleteDate: date,
          status: status
        });
        if (!data) {
          req.flash("success", "Blog is not Added");
          return res.redirect("back");
        }
        return res.redirect("/blog");
      }
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const deleteblog = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      let data = await blog.findByIdAndDelete(req.query.id);
      if (data) {
        let image = data.image;
        for (let i = 0; i < image.length; i++) {
          fs.unlinkSync(data.image[i]);
        }
        let comment = await Comment.deleteMany({ blogId: req.query.id });
        let Like = await like.deleteMany({ blogId: req.query.id });
        let saveBlog = await Saveblog.deleteMany({ blogId: req.query.id });
        if ((comment, Like, saveBlog)) {
          req.flash("success", "Blog is Deleted");
          return res.redirect("back");
        } else {
          req.flash("success", "Blog is not Deleted");
          return res.redirect("back");
        }
      }
      req.flash("success", "Blog is not Deleted");
      return res.redirect("back");
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
          let image = Blogdata.image;
          for (let i = 0; i < image.length; i++) {
            fs.unlinkSync(Blogdata.image[i]);
          }

          let data = await blog.findByIdAndUpdate(id, {
            categoryId: theme,
            detail: detail,
            title: title,
            postDeleteDate: date,
            status: status,
            image: req.files.map((file) => file.path),
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
  const { startIndex, limit } = req.pagination;

  const categorydata = await category.find({});

  categorySearch = await category.find({
    theme: { $regex: req.body.search },
  });

  themes = categorySearch.map((val) => val.theme);


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

const DateSearchData = async (req, res) => {
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

const getCategoryResult = async (req, res) => {
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
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
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
