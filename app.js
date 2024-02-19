import express from 'express';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 7500;
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(flash());
app.use(cookieParser());

app.use(
  session({
    secret: "blog",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  next();
});


import { routes } from './router/main.js';
import { userRoutes } from './router/user.js';
import { categoryRoutes } from './router/category.js';
import { blogRoutes } from './router/blog.js';

app.use("/", routes);
app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", blogRoutes);


app.use("/public", express.static(path.join(__dirname, "public")));

import { db } from "./config/mongoose.js";
import { passport } from "./helper/auth.js";

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
 
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    return res.redirect("/");
  }
);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log("Server is working on port :" + port);
});