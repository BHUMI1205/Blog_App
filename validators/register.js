import validator from "validator";

const validateRegisterData = (fname, lname, username, email, password) => {
  if (!fname || !lname || !username || !email || !password) {
    return "Fill all fields";
  } else if (fname === "" || lname === "" || username === "" || email === "" || password === "") {
    return "Fill all fields";
  } else if (!validator.isAlpha(fname)) {
    return "First name must be a string";
  } else if (!validator.isAlpha(lname)) {
    return "Last name must be a string";
  } else if (validator.isEmpty(username)) {
    return "Username must be added";
  } else if (!validator.isEmail(email)) {
    return "Email is not valid";
  } else if (password.length !== 6) {
    return "Password length must be 6 characters";
  } else {
    return null;
  }
};

const validateNewUserRegisterData = (fname, lname, username, email) => {
  if (!fname || !lname || !username || !email) {
    return "Fill all fields";
  } else if (fname === "" || lname === "" || username === "" || email === "") {
    return "Fill all fields";
  } else if (!validator.isAlpha(fname)) {
    return "First name must be a string";
  } else if (!validator.isAlpha(lname)) {
    return "Last name must be a string";
  } else if (validator.isEmpty(username)) {
    return "Username must be added";
  } else if (!validator.isEmail(email)) {
    return "Email is not valid";
  } else {
    return null;
  }
};

export { validateRegisterData, validateNewUserRegisterData };
