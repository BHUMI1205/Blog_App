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
  if (theme === "" || detail === "") {
    return "Fill all fields";
  } else if (validator.isEmpty(theme) == true) {
    return "Category is not Added";
  } else if (validator.isEmpty(detail) == true) {
    return "Description is not Added";
  } else {
    return null;
  }
};

export{ validateCategoryData, validateUpdateCategoryData };
