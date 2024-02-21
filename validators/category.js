import validator from "validator";

const validateCategoryData = (theme, detail, image) => {
  if (theme === "" || detail === "") {
    return "Fill all fields";
  } else if (validator.isEmpty(theme) == true) {
    return "Category is not Added";
  } else if (validator.isEmpty(detail) == true) {
    return "Description is not Added";
  } else if (image == undefined) {
    return "Image is not Added";
  } else {
    return null;
  }
};

const validateUpdateCategoryData = (theme, detail) => {
  if (!validator.isAlpha(theme)) {
    return "Category is not in string";
  } else if (!validator.isAlpha(detail)) {
    return "Description is not in string";
  } else {
    return null;
  }
};

export { validateCategoryData, validateUpdateCategoryData };
