import jsonwebtoken from "jsonwebtoken";

import passport from "../helper/auth.js";
import sessionStorage from "sessionstorage-for-nodejs";

const jwt = (req, res, next) => {

  // Retrieve data
  // const token = sessionStorage.getItem('token');
  const token = req.cookies.token;

  if (token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, "logindata");
      let obj = {
        id: decodedToken.payload._id,
        role: decodedToken.payload.role,
        IsSubscribed: decodedToken.payload.IsSubscribed
      }
      req.user = obj;
      return next();
    } catch (error) {
      console.log("Invalid Token:", error);
    }
  }

  return next()
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role == role || req.user.role == "superAdmin") {
        return next();
      } else {
        req.flash("success", "Access denied");
        return res.redirect('back');
      }
    } else {
      return res.redirect('/')
    }
  }
}


export { jwt, checkRole };