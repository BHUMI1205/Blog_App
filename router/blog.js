import express from 'express';

const blogRoutes = express.Router();

import { getBlog, blogAdd, blogDataAdd, deleteblog, editblog, blogupdate, blogger, likes, unlike, follow, unfollow, save, unsave, savedblogs, comments, searchData, dateSearchData, getCategoryResult, userPost, blogActive, blogDeactive, adminRole, userRole, paypalPayment, paypalsuccess, paypalcancel } from "../controller/blogcontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { multipleimageUpload } from "../middelwares/images.js";
import { paginationMiddleware } from "../middelwares/pagination.js";


/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Render the user's blogs.
 *     responses:
 *       '200':
 *         description: Successfully rendered the user's blog.
 */
blogRoutes.get("/blog", jwt, paginationMiddleware, getBlog);

/**
 * @swagger
 * /blog_Add:
 *   get:
 *     summary: Render the blog add page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the blog add page.
 */
blogRoutes.get("/blog_Add", jwt, blogAdd);

/**
 * @swagger
 * /add_blogData:
 *   post:
 *     summary: add a blog.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string 
 *                   format: binary
 *               detail:
 *                 type: string
 *               theme:
 *                 type: mongoose.Schema.Types.ObjectId
 *                 ref: "category"
 *               postDeleteDate:
 *                 type: Date
 *                 format: date
 *               status:
 *                 type: Number
 *             required: 
 *               - title
 *               - image
 *               - detail 
 *               - theme
 *     responses:
 *       '200':
 *         description: blog successfully added.
 *       '400':
 *         description: Bad request.
 */
blogRoutes.post("/add_blogData", jwt, multipleimageUpload, blogDataAdd);

/**
 * @swagger
 * /delete_blog?{id}:
 *   get:
 *     summary: delete a blog.
 *     description: Delete blog
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to delete
 *     responses:
 *       '200':
 *         description: blog successfully added.
 *       '400':
 *         description: Bad request.
 */
blogRoutes.get("/delete_blog", jwt, deleteblog);

/**
 * @swagger
 * /edit_blog?{id}:
 *   get:
 *     summary: Render the blog edit page.
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to delete
 *     responses:
 *       '200':
 *         description: Successfully rendered the blog edit page.
 */
blogRoutes.get("/edit_blog", jwt, editblog);

/**
 * @swagger
 * /update_blog:
 *   post:
 *     summary: add a blog.
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string 
 *                   format: binary
 *               detail:
 *                 type: string
 *               theme:
 *                 type: mongoose.Schema.Types.ObjectId
 *                 ref: "category"
 *               postDeleteDate:
 *                 type: Date
 *                 format: date
 *               status:
 *                 type: Number
 *     responses:
 *       '200':
 *         description: blog successfully added.
 *       '400':
 *         description: Bad request.
 */
blogRoutes.post("/update_blog", jwt, multipleimageUpload, blogupdate);

/**
 * @swagger
 * /blogger?{bloggerId}:
 *   get:
 *     summary: Render the blogger's blogs.
 *     parameters:
 *        - in: query 
 *          name: username
 *          schema:
 *              type: ObjectId
 *          required: true 
 *          description: string id of blog
 *     responses:
 *       '200':
 *         description: Successfully rendered the blogger's blog.
 */
blogRoutes.get("/blogger", jwt, paginationMiddleware, blogger);

/**
 * @swagger
 * /like?{id}:
 *   get:
 *     summary: Like blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to Like
 *     responses:
 *       '200':
 *         description: Successfully Like the blog.
 */
blogRoutes.get("/like", jwt, likes);

/**
 * @swagger
 * /unlike?{id}:
 *   get:
 *     summary: Unlike blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to Unlike
 *     responses:
 *       '200':
 *         description: Successfully Unlike the blog.
 */
blogRoutes.get("/unlike", jwt, unlike);

/**
 * @swagger
 * /follow?{id}:
 *   get:
 *     summary: save blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to save
 *     responses:
 *       '200':
 *         description: Successfully save the blog.
 */
blogRoutes.get("/follow", jwt, follow);

/**
 * @swagger
 * /unfollow?{id}:
 *   get:
 *     summary: Unsave blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to Unsave
 *     responses:
 *       '200':
 *         description: Successfully Unsave the blog.
 */
blogRoutes.get("/unfollow", jwt, unfollow);

/**
 * @swagger
 * /save?{id}:
 *   get:
 *     summary: save blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to save
 *     responses:
 *       '200':
 *         description: Successfully save the blog.
 */
blogRoutes.get("/save", jwt, save);

/**
 * @swagger
 * /unsave?{id}:
 *   get:
 *     summary: Unsave blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to Unsave
 *     responses:
 *       '200':
 *         description: Successfully Unsave the blog.
 */
blogRoutes.get("/unsave", jwt, unsave);

/**
 * @swagger
 * /savedblogs:
 *   get:
 *     summary: Render the user's saved blogs.
 *     responses:
 *       '200':
 *         description: Successfully rendered the user's saved blog.
 */
blogRoutes.get("/savedblogs", paginationMiddleware, jwt, savedblogs);

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: comment on blog .
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: string
 *               comment:
 *                 type: string
 *             required:
 *               - blogId
 *               - comment
 *     responses:
 *       '200':
 *         description: Successfully comment on the blog.
 */
blogRoutes.post("/comment", jwt, comments);

/**
 * @swagger
 * /searchData:
 *   post:
 *     summary: search on blog.
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *             required:
 *               - search
 *     responses:
 *       '200':
 *         description: Successfully search the blog.
 */
blogRoutes.post("/searchData", paginationMiddleware, jwt, searchData);

/**
 * @swagger
 * /dateSearchData:
 *   post:
 *     summary: search on blog.
 *     requestBody:
 *       required: true
 *       content:
 *          application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *             required:
 *               - startDate 
 *               - endDate 
 *     responses:
 *       '200':
 *         description: Successfully search the blog.
 */
blogRoutes.post("/dateSearchData", paginationMiddleware, jwt, dateSearchData);

/**
 * @swagger
 * /getCategoryResult?{categoryId}:
 *   get:
 *     summary: get blog by category.
 *     parameters:
 *        - in: query 
 *          name: categoryId
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of category to get blog 
 *     responses:
 *       '200':
 *         description: Successfully get the blog.
 */
blogRoutes.get("/getCategoryResult", paginationMiddleware, jwt, getCategoryResult);

/**
 * @swagger
 * /userPost?{userId}:
 *   get:
 *     summary: get blog of user.
 *     parameters:
 *        - in: query 
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of user to get blog 
 *     responses:
 *       '200':
 *         description: Successfully get the blog.
 */
blogRoutes.get("/userPost", paginationMiddleware, jwt, userPost);

/**
 * @swagger
 * /blogActive?{id}:
 *   get:
 *     summary: Active blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to Active blog 
 *     responses:
 *       '200':
 *         description: Successfully Active the blog.
 */
blogRoutes.get("/blogActive", paginationMiddleware, jwt, blogActive);

/**
 * @swagger
 * /blogDeactive?{id}:
 *   get:
 *     summary: Deactive blog .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of blog to Deactive blog 
 *     responses:
 *       '200':
 *         description: Successfully Deactive the blog.
 */
blogRoutes.get("/blogDeactive", paginationMiddleware, jwt, blogDeactive);

/**
 * @swagger
 * /adminRole?{id}:
 *   get:
 *     summary: make Admin .
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of user to make Admin .
 *     responses:
 *       '200':
 *         description: Successfully change the role.
 */
blogRoutes.get("/adminRole", jwt, checkRole('superAdmin'), paginationMiddleware, adminRole);

/**
 * @swagger
 * /userRole?{id}:
 *   get:
 *     summary: make User.
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of user to make User .
 *     responses:
 *       '200':
 *         description: Successfully change the role.
 */
blogRoutes.get("/userRole", jwt, checkRole('superAdmin'), paginationMiddleware, userRole);
blogRoutes.get("/paypalPayment", jwt, paypalPayment);
blogRoutes.get("/paypalsuccess", jwt, paypalsuccess);
blogRoutes.get("/paypalcancel", jwt, paypalcancel);

export { blogRoutes };