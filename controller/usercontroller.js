import { user, blog, category } from "./models.js";
import { validateRegisterData, validateNewUserRegisterData } from "../validators/register.js";
import { validateLoginData, validateEmailData, validatePasswordData } from "../validators/login.js";
import { blogPostData } from '../Aggregrate/blogPost_aggregation.js';
import jwt from "jsonwebtoken";
import sessionStorage from "sessionstorage-for-nodejs";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import logger from '../logger.js';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const register = (req, res) => {
  return res.render("Login/register");
};

const userdata = async (req, res) => {
  try {
    const { fname, lname, username, email, password, cpassword } = req.body;

    const validationError = validateRegisterData(
      fname,
      lname,
      username,
      email,
      password
    );

    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else {
      if (password == cpassword) {
        let userdata = await user.findOne({ username: username });
        if (!userdata) {
          let data = await user.create({
            fname: fname,
            lname: lname,
            username: username,
            email: email,
            password: password,
          });
          if (data) {
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "bhumiitaliya.crawlapps@gmail.com",
                pass: "peur yugv vdfl ljpz",
              },
            });
            var mailOptions = {
              from: "bhumiitaliya.crawlapps@gmail.com",
              to: data.email,
              subject: "Sending Email using Node.js",
              html: `Your registration is completed.`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              }
            });
            return res.redirect("/login");
          } else {
            logger.warning("User is not Registered")
            req.flash("success", "User is not Registered");
            return false;
          }
        } else {
          logger.warning("User is already Registered")
          req.flash("success", "Username is already Registered");
          return res.redirect("back");
        }
      } else {
        logger.warning("Password and confirm password do not match")
        req.flash("success", "Password and confirm password do not match");
        return res.redirect("back");
      }
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const login = (req, res) => {
  res.clearCookie("token");
  return res.render("Login/login");
};

const logindata = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationError = validateLoginData(email, password);
    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else {
      let userdata = await user.findOne({ email: email });
      if (userdata) {
        const result = await bcrypt.compare(password, userdata.password);
        if (result) {
          const token = jwt.sign({ payload: userdata }, "logindata", {
            expiresIn: "1hr",
          });
          // Set data
          // sessionStorage.setItem('token', token); 
          res.cookie("token", token, { maxAge: 3600000, httpOnly: true, secure: true, sameSite: "Strict" });
          return res.redirect("/");
        } else {
          logger.warning("Password is wrong")
          req.flash("success", "Password is wrong");
          return res.redirect("back");
        }
      } else {
        logger.warning("Email is wrong")
        req.flash("success", "Email is wrong");
        return res.redirect("back");
      }
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const forgotpassword = (req, res) => {
  return res.render("Login/forgotEmail");
};

const emailAddress = async (req, res) => {
  try {
    const { email } = req.body;
    const validationError = validateEmailData(email);
    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else {
      let userdata = await user.findOne({ email: email });
      if (userdata) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bhumiitaliya.crawlapps@gmail.com",
            pass: "peur yugv vdfl ljpz",
          },
        });
        let otp = Math.floor(Math.random() * 100000);
        var mailOptions = {
          from: "bhumiitaliya.crawlapps@gmail.com",
          to: req.body.email,
          subject: "Sending Email using Node.js",
          html: `Your OTP for generating a new password: ${otp}. Click <a href="http://localhost:7500/otp">here</a> to reset your password.`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(error)
            console.log(error);
          } else {
            let obj = {
              email: req.body.email,
              otp: otp,
            };
            logger.info("Email sent")
            console.log("Email sent: " + info.response);
            res.cookie("forgetpassword", obj);
            return res.redirect("back");
          }
        });
      } else {
        logger.warning("Email is wrong")
        req.flash("success", "Email is wrong");
        return res.redirect("back");
      }
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const getOtp = (req, res) => {
  return res.render("Login/otp");
};

const otpdata = async (req, res) => {
  try {
    if (req.cookies['foretpassword']) {
      let cookieotp = req.cookies["forgetpassword"].otp;
      let otp = req.body.otp;
      if (cookieotp == otp) {
        return res.redirect("/change_password");
      } else {
        logger.warning("otp is wrong")
        req.flash("otp", "otp is wrong");
        return res.redirect("back");
      }
    } else {
      logger.warning("otp is Expired")
      req.flash("otp", "otp is Expired");
      return res.redirect("/login");
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const changepassword = (req, res) => {
  return res.render("Login/changepssword");
};

const newpassword = async (req, res) => {
  try {
    const { password, cpassword } = req.body;
    const validationError = validatePasswordData(password);

    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else if (password == cpassword) {
      let email = req.cookies["forgetpassword"].email;
      const updateEmail = await user.findOne({ email: email });
      let id = updateEmail.id;
      const updatepass = await user.findByIdAndUpdate(id, {
        password: password,
      });

      if (updatepass) {
        res.clearCookie("forgetpassword");
        return res.redirect("/login");
      } else {
        logger.warning("Password not changed")
        req.flash("success", "Password not changed");
        return res.redirect("back");
      }
    } else {
      logger.warning("password and confirm password is not same")
      req.flash("success", "password and confirm password is not same");
      return res.redirect("back");
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const newUser = async (req, res) => {
  try {
    return res.render('Login/newUser')
  }
  catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
}

const newUserdata = async (req, res) => {
  try {
    const { fname, lname, username, email, role } = req.body;

    const validationError = validateNewUserRegisterData(
      fname,
      lname,
      username,
      email
    );

    if (validationError) {
      req.flash("success", validationError);
      return res.redirect("back");
    } else {
      let password = Math.floor(Math.random() * 1000000);

      let userdata = await user.findOne({ username: username });
      if (!userdata) {
        let data = await user.create({
          fname: fname,
          lname: lname,
          username: username,
          email: email,
          role: role,
          password: password
        });

        if (data) {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "italiyabhumi05@gmail.com",
              pass: "ozqe tzzy ymjx yyif",
            },
          });
          var mailOptions = {
            from: "italiyabhumi05@gmail.com",
            to: data.email,
            subject: "Sending Email using Node.js",
            html: `Your registration is completed.This is your temporary password: ` + password,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              logger.error(error)
              console.log(error);
            }
          });
          logger.info("User is Registered Successfully")
          req.flash("success", "User is Registered Successfully");
          return res.redirect("back");
        } else {
          logger.warning("User is not Registered")
          req.flash("success", "User is not Registered");
          return false;
        }
      } else {
        logger.warning("User is already Registered")
        req.flash("success", "Username is already Registered");
        return res.redirect("back");
      }
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return false;
  }
}

const msgToAI = async (req, res) => {
  try {
    const categorydata = await category.find({});
    const { startIndex, limit } = req.pagination;

    let blogs = await blog.aggregate(blogPostData).skip(startIndex)
      .limit(limit);

    const message = req.body.msg;
    console.log(message);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const response = completion.choices[0].message.content;

    return res.render("AdminPanel/index", {
      categorydata,
      themes: [],
      blogs,
      totalPages: Math.ceil(blogs.length / limit),
      page: req.pagination.page,
      user: req.user,
      limit,
      response
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export {
  register,
  userdata,
  login,
  logindata,
  forgotpassword,
  emailAddress,
  getOtp,
  otpdata,
  changepassword,
  newpassword,
  logout,
  newUser,
  newUserdata,
  msgToAI
};
