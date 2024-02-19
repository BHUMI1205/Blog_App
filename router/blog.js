import express from 'express';

const blogRoutes = express.Router();

import { getBlog, blogAdd, blogDataAdd, deleteblog, editblog, blogupdate, likes, unlike, save, unsave, savedblogs, comments, searchData, DateSearchData, getCategoryResult, userPost, blogActive, blogDeactive, adminRole, userRole } from "../controller/blogcontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { multipleimageUpload } from "../middelwares/images.js";
import { paginationMiddleware } from "../middelwares/pagination.js";


blogRoutes.get("/blog", jwt, paginationMiddleware, getBlog);
blogRoutes.get("/blog_Add", jwt, blogAdd);
blogRoutes.post("/add_blogData", jwt, multipleimageUpload, blogDataAdd);
blogRoutes.get("/delete_blog", jwt, deleteblog);
blogRoutes.get("/edit_blog", jwt, editblog);
blogRoutes.post("/update_blog", jwt, multipleimageUpload, blogupdate);
blogRoutes.get("/like", jwt, likes);
blogRoutes.get("/unlike", jwt, unlike);
blogRoutes.get("/save", jwt, save);
blogRoutes.get("/unsave", jwt, unsave);
blogRoutes.get("/savedblogs", paginationMiddleware, jwt, savedblogs);
blogRoutes.post("/comment", jwt, comments);
blogRoutes.post("/searchData", paginationMiddleware, jwt, searchData);
blogRoutes.post("/DateSearchData", paginationMiddleware, jwt, DateSearchData);
blogRoutes.get("/getCategoryResult", paginationMiddleware, jwt, getCategoryResult);
blogRoutes.get("/userPost", paginationMiddleware, jwt, userPost);
blogRoutes.get("/blogActive", paginationMiddleware, jwt, blogActive);
blogRoutes.get("/blogDeactive", paginationMiddleware, jwt, blogDeactive);
blogRoutes.get("/adminRole", jwt, checkRole('superAdmin'), paginationMiddleware, adminRole);
blogRoutes.get("/userRole", jwt, checkRole('superAdmin'), paginationMiddleware, userRole);

export { blogRoutes };