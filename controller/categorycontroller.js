import streamifier from "streamifier";
import { category, blog, like, Comment, followBlogger } from "./models.js";
import { validateCategoryData, validateUpdateCategoryData } from "../validators/category.js";
import logger from '../logger.js';

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
    logger.error(err);
    console.log(err);
    return false;
  }
};

const categoryAdd = async (req, res) => {
  try {
    const categorydata = await category.find({});
    return res.render("Category/categoryAdd", {
      user: req.user,
      categorydata
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const categoryDataAdd = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      let file = req.file
      const { theme, detail, status } = req.body;
      let categoryData = await category.findOne({ theme: theme });
      const validationError = validateCategoryData(theme, detail, file);

      if (categoryData) {
        logger.warning("Category already exists")
        req.flash("error", "Category already exists");
        return res.redirect("back");
      } else {
        if (validationError) {
          req.flash("error", validationError);
          return res.redirect("back");
        } else {
          const uploadStream = cloudinary.uploader.upload_stream({
            public_id: Date.now() + Math.floor((Math.random() * 1000000)),
            resource_type: "image",
            folder: "blogs/image"

          }, (err, result) => {
            if (err) {
              logger.warning("Error uploading image to Cloudinary")
              req.flash("error", "Error uploading image to Cloudinary");
              return res.redirect("back");
            }
            else {
              let imageUrl = result.url;

              let data = category.create({
                theme: theme,
                detail: detail,
                image: imageUrl,
                public_id: result.public_id,
                adminId: req.user.id, 
                status: status
              });
              if (!data) {
                logger.warning("Category is not Added")
                req.flash("error", "Category is not Added");
                return res.redirect("back");
              } else {
                logger.warning("Category is Added")
              }
            }
          }
          )
        }
      }
    }
    else {
      return res.redirect('/')
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.redirect("back");
  }
};

const deletecategory = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      let imageFile = await category.findById(req.query.id);
      if (imageFile) {
        let publicId = imageFile.public_id;
        const file = cloudinary.uploader.destroy(publicId);
        let data = await category.findByIdAndDelete(req.query.id);
        if (data) {
          let blogDocuments = await blog.find({ categoryId: req.query.id });
          if (blogDocuments) {
            blogDocuments.map((val) => {
              let image = val.image;
              for (let i = 0; i < image.length; i++) {
                const file = cloudinary.uploader.destroy(val.image[i]);
              }
            });
            console.log(blogDocuments);
            if (blogDocuments == true) {
              let blogData = await blog.deleteMany({ categoryId: req.query.id });
              let comment = await Comment.deleteMany({ blogId: blogDocuments[0]._id });
              let Like = await like.deleteMany({ blogId: blogDocuments[0]._id });
              let followBlogger = await followBlogger.deleteMany({ blogId: blogDocuments[0]._id });

              if (blogData || comment || Like || followBlogger || "") {
                logger.info("Category is Deleted")
                req.flash("success", "Blog is Deleted");
                return res.redirect("back");
              } else {
                logger.warning("Category is not Deleted")
                req.flash("success", "Blog is not Deleted");
                return res.redirect("back");
              }
            } else {
              logger.info("Category is Deleted")
              req.flash("success", "Blog is Deleted");
              return res.redirect("back");
            }

          }
        } else {
          logger.warning("Category is not Deleted")
          req.flash("success", "Category is not Deleted");
          return res.redirect("back");
        }
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

const editcategory = async (req, res) => {
  try {
    let categorydata = await category.find({});
    let data = await category.findById(req.query.id);
    return res.render("Category/editcategory", {
      data,
      user: req.user,
      categorydata
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const categoryupdate = async (req, res) => {
  try {
    const { id, theme, detail, status } = req.body;
    if (theme || detail) {
      const validationError = validateUpdateCategoryData(theme, detail);
      if (validationError) {
        req.flash("success", validationError);
        return res.redirect("back");
      }
      else {
        let categories = await category.findById(id);
        if (req.file) {
          let publicId = categories.public_id;
          cloudinary.uploader.destroy(publicId);
          const uploadStream = cloudinary.uploader.upload_stream({
            public_id: Date.now() + Math.floor((Math.random() * 1000000)),
            resource_type: "image",
            folder: "blogs/image"

          }, async (err, result) => {
            if (err) {
              logger.warning("Error uploading image to Cloudinary")
              req.flash("error", "Error uploading image to Cloudinary");
              return res.redirect("back");
            }
            else {
              let data = await category.findByIdAndUpdate(id, {
                theme: theme,
                detail: detail,
                status: status,
                image: result.url,
                public_id: result.public_id,
                adminId: req.user.id,
              });
              if (data) {
                return res.redirect("/category");
              } else {
                logger.warning("Category is not updated")
                req.flash("success", "Category is not updated");
                return res.redirect("/category");
              }
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
          let data = await category.findByIdAndUpdate(id, {
            theme: theme,
            detail: detail,
            status: status,
            image: categories.image,
          });
          if (data) {
            return res.redirect("/category");
          } else {
            logger.warning("Category is not updated")
            req.flash("success", "Category is not updated");
            return res.redirect("/category");
          }
        }
      }
    } else {
      return res.redirect("back");
    }
  }
  catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

export {
  getCategory,
  categoryDataAdd,
  categoryAdd,
  deletecategory,
  editcategory,
  categoryupdate,
};
