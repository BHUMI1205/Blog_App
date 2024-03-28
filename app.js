import express from 'express';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';
import "./config/mongoose.js";
import passport from "./helper/auth.js";

import blogSwaggerSpecs from './api-docs/blog-swagger.js';

import { routes } from './router/main.js';
import { userRoutes } from './router/user.js';
import { categoryRoutes } from './router/category.js';
import { blogRoutes } from './router/blog.js';
import { seedAdmin } from './seeder/admin-seeder.js';

const app = express();
const port = process.env.PORT || 7500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
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

app.use('/blog-docs', swaggerUi.serve, swaggerUi.setup(blogSwaggerSpecs));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", blogRoutes);

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

seedAdmin().then(() => {
  console.log("Admin seeding completed");
}).catch((err) => {
  console.error("Error seeding admin:", err);
});

const server = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log("Server is working on port :" + port);
});

let io = new Server(server)

io.on('connection', (socket) => {

  socket.on('userId', (userId) => {
    socket.join(userId);
  });

  socket.on('like', (bloggerId) => {
    io.in(bloggerId).emit('userlikes', bloggerId);
  });

  socket.on('follow', (bloggerId) => {
    io.in(bloggerId).emit('userfollows', bloggerId);
  });

});