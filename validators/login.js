import validator from "validator";

const validateLoginData = (email, password) => {
  if (!email || !password) {
    return "Fill all fields";
  } else if (email === "" || password === "") {
    return "Fill all fields";
  } else if (validator.isEmail(email) == false) {
    return "Email is not right";
  } else if ((password.length === 6) === false) {
    return "Password length must be 6 digits";
  } else {
    return null;
  }
};

const validateEmailData = (email) => {
  if (!email) {
    return "Fill all fields";
  } else if (email === "") {
    return "Fill all fields";
  }else if (validator.isEmail(email) == false) {
    return "Email is not right";
  } else {
    return null;
  }
};

const validatePasswordData = (password) => {
  if (!password) {
    return "Fill all fields";
  } else if (password === "") {
    return "Fill all fields";
  }else if ((password.length === 6) === false) {
    return "Password length must be 6 digits";
  } else {
    return null;
  }
};

export { validateLoginData, validatePasswordData, validateEmailData };
