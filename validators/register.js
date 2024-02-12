const validator = require("validator");

const validateUserData = (fname, lname, username, email, password) => {
  if (fname === "" || lname === "" || username === "" || email === "" || password === "") {
    return "Fill all fields";
  } else if (!validator.isAlpha(fname)) {
    return "First name must be in String";
  } else if (!validator.isAlpha(lname)) {
    return "Last name must be in String";
  } else if (validator.isEmpty(username)) {
    return "Username must be added";
  } else if (!validator.isEmail(email)) {
    return "Email is not valid";
  } else if (password.length !== 6) {
    return "Password length must be 6 digits";
  } else {
    return null;
  }
};


const validateNewUserRegisterData = (fname, lname, username, email) => {
  if (fname === "" || lname === "" || username === "" || email === "") {
    return "Fill all fields";
  } else if (!validator.isAlpha(fname)) {
    return "First name must be in String";
  } else if (!validator.isAlpha(lname)) {
    return "Last name must be in String";
  } else if (validator.isEmpty(username)) {
    return "Username must be added";
  } else if (!validator.isEmail(email)) {
    return "Email is not valid";
  } else {
    return null;
  }
};


module.exports = { validateUserData, validateNewUserRegisterData }