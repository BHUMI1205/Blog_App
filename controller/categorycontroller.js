const fs = require("fs");
const { category, blog, like, Comment, saveBlog } = require("./controller");
const { validateCategoryData ,validateUpdateCategoryData} = require("../validators/category");

const getCategory = async (req, res) => {
  try {
    const categorydata = await category.find({});
    let data = await category.find({});
    return res.render("Category/category", {
      data,
      user: req.user,
      categorydata
    });
  } catch (err) {
    console.log(err); 
    return false;
  }
}; 

const categoryAdd = async (req, res) => {
  try {
    return res.render("Category/categoryAdd",{
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    return false;
  }
};

const categoryDataAdd = async (req, res) => {
  try {
    const { theme, detail,status } = req.body;
    let image = req.file;
    const validationError = validateCategoryData(theme, detail, image);
    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else {
      let categoryData = await category.findOne({ theme: theme });
      if (!categoryData) {
        let data = await category.create({
          theme: theme,
          detail: detail,
          image: req.file.path,
          adminId: req.user.id,
          status:status
        });
        if (!data) {
          req.flash("success", "Category is not Added");
          return res.redirect("back");
        }
        return res.redirect("/category");
      } else {
        req.flash("success", "Category is already Added");
        return res.redirect("back");
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const deletecategory = async (req, res) => {
  try {
    let data = await category.findByIdAndDelete(req.query.id);
    if (data) {
      fs.unlinkSync(data.image);
      let blogDocuments = await blog.find({ categoryId: req.query.id });
      if (blogDocuments) {
        blogDocuments.map((val) => {
          let image = val.image;
          for (let i = 0; i < image.length; i++) {
            fs.unlinkSync(val.image[i]);
          }
        });
        let blogData = await blog.deleteMany({ categoryId: req.query.id });
        let comment = await Comment.deleteMany({
          blogId: blogDocuments[0]._id,
        });
        let Like = await like.deleteMany({ blogId: blogDocuments[0]._id });
        let Saveblog = await saveBlog.deleteMany({
          blogId: blogDocuments[0]._id,
        });
        if ((blogData, comment, Like, Saveblog)) {
          req.flash("success", "Blog is Deleted");
          return res.redirect("back");
        } else {
          req.flash("success", "Blog is not Deleted");
          return res.redirect("back");
        }
      }
    } else {
      req.flash("success", "Category is not Deleted");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const editcategory = async (req, res) => {
  try {
    let data = await category.findById(req.query.id);
    return res.render("Category/editcategory", {
      data,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    return false;
  }
};

const categoryupdate = async (req, res) => {
  try {
    const { id, theme, detail,status} = req.body;
    const validationError = validateUpdateCategoryData(theme, detail);
    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else {
      let categories = await category.findById(id);
      if (req.file) {
        fs.unlinkSync(categories.image);
        let data = await category.findByIdAndUpdate(id, {
          theme: theme,
          detail: detail,
          status:status,
          image: req.file.path,
        });
        if (data) {
          return res.redirect("/category");
        } else {
          req.flash("success", "Category is not updated");
          return res.redirect("/category");
        }
      } else {
        let data = await category.findByIdAndUpdate(id, {
          theme: theme,
          detail: detail,
          status:status,
          image: categories.image,
        });
        if (data) {
          return res.redirect("/category");
        }
        req.flash("success", "Category is not updated");
        return res.redirect("/category");
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  getCategory,
  categoryDataAdd,
  categoryAdd,
  deletecategory,
  editcategory,
  categoryupdate, 
};
