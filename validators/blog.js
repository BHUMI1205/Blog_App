const validator = require("validator");

const validateBlogData = (title, detail, imageLength) => {
  if (validator.isEmpty(title) == true) {
    return "Title have to Added";
  } else if (validator.isEmpty(detail) == true) {
    return "Detail have to Added";
  } else if (imageLength === 0) {
    return "Image have to be added";
  } else if (imageLength > 4) {
    return "You can only add 4 Images";
  } else {
    return null;
  }
};

const validateUpdateBlogData = (title, detail) => {
  if (validator.isEmpty(title) == true) {
    return "Title have to Added";
  } else if (validator.isEmpty(detail) == true) {
    return "Detail have to Added";
  } else {
    return null;
  }
};

const validateUpdateLikeData = (req,res) => {
    return "You have to Login First";
};

module.exports = { validateBlogData, validateUpdateBlogData,validateUpdateLikeData };
