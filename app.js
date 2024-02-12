const express = require("express");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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

app.use("/", require("./router"));
app.use("/", require("./router/user"));
app.use("/", require("./router/category")); 
app.use("/", require("./router/blog"));
 
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
const db = require("./config/mongoose");
const auth = require("./helper/auth");

app.get(
  "/auth/google", 
  auth.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  auth.authenticate("google", { failureRedirect: "/login" }),
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