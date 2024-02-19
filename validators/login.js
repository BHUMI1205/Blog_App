import validator from "validator";

const validateLoginData = (email, password) => {
  if (email === "" || password === "") {
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
  if (validator.isEmail(email) == false) {
    return "Email is not right";
  } else {
    return null;
  }
};

const validatePasswordData = ( password) => {
  if ((password.length === 6) === false) {
    return "Password length must be 6 digits";
  } else {
    return null;
  }
};

export{ validateLoginData, validatePasswordData, validateEmailData };
