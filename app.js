import express from 'express';
import http from "http";
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 7500;

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user has connected");
});


import logger from './logger.js'
// import userSwaggerSpecs from './api-docs/user-swagger.js';
// import categorySwaggerSpecs from './api-docs/category-swagger.js';
import blogSwaggerSpecs from './api-docs/blog-swagger.js';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  session({
    secret: "blog",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  next();
});

import { routes } from './router/main.js';
import { userRoutes } from './router/user.js';
import { categoryRoutes } from './router/category.js';
import { blogRoutes } from './router/blog.js';

// app.use('/user-docs', swaggerUi.serve, swaggerUi.setup(userSwaggerSpecs));
// app.use('/category-docs', swaggerUi.serve, swaggerUi.setup(categorySwaggerSpecs));
app.use('/blog-docs', swaggerUi.serve, swaggerUi.setup(blogSwaggerSpecs));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", blogRoutes);

import { db } from "./config/mongoose.js";
import passport from "./helper/auth.js";

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