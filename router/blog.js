import express from 'express';

const blogRoutes = express.Router();


import * as blog from "../controller/blogcontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { multipleimageUpload } from "../middelwares/images.js";
import { paginationMiddleware } from "../middelwares/pagination.js";


blogRoutes.get("/blog", jwt, paginationMiddleware, blog.getBlog);
blogRoutes.get("/singleBlogPost", jwt, blog.singleBlogPost);
blogRoutes.get("/blog_Add", jwt, blog.blogAdd);

/**
 * @swagger
 * /add_blogData:
 *   post:
 *     tags:
 *     - Blog 
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
blogRoutes.post("/add_blogData", jwt, multipleimageUpload, blog.blogDataAdd);

/**
 * @swagger
 * /delete_blog?{id}:
 *   delete:
 *     tags:
 *     - Blog 
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
blogRoutes.delete("/delete_blog", jwt, blog.deleteblog);
blogRoutes.get("/edit_blog", jwt, blog.editblog);

/**
 * @swagger
 * /update_blog:
 *   post:
 *     tags:
 * 
 *     - Blog 
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
blogRoutes.post("/update_blog", jwt, multipleimageUpload, blog.blogupdate);
blogRoutes.get("/blogger", jwt, paginationMiddleware, blog.blogger);

/**
 * @swagger
 * /like?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/like", jwt, blog.likes);

/**
 * @swagger
 * /unlike?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/unlike", jwt, blog.unlike);

/**
 * @swagger
 * /follow?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/follow", jwt, blog.follow);

/**
 * @swagger
 * /unfollow?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/unfollow", jwt, blog.unfollow);

/**
 * @swagger
 * /save?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/save", jwt, blog.save);

/**
 * @swagger
 * /unsave?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/unsave", jwt, blog.unsave);
blogRoutes.get("/savedblogs", paginationMiddleware, jwt, blog.savedblogs);

/**
 * @swagger
 * /comment:
 *   post:
 *     tags:
 *     - Blog 
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
blogRoutes.post("/comment", jwt, blog.comments);

/**
 * @swagger
 * /searchData:
 *   post:
 *     tags:
 *     - Blog 
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
blogRoutes.post("/searchData", paginationMiddleware, jwt, blog.searchData);

/**
 * @swagger
 * /dateSearchData:
 *   post:
 *     tags:
 *     - Blog 
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
blogRoutes.post("/dateSearchData", paginationMiddleware, jwt, blog.dateSearchData);

/**
 * @swagger
 * /getCategoryResult?{categoryId}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/getCategoryResult", paginationMiddleware, jwt, blog.getCategoryResult);

/**
 * @swagger
 * /userPost?{userId}:
 *   get:
 *     tags:
 *     - Blog 
 *     summary: get blog of blog.
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
blogRoutes.get("/userPost", paginationMiddleware, jwt, blog.userPost);

/**
 * @swagger
 * /blogActive?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/blogActive", paginationMiddleware, jwt, blog.blogActive);

/**
 * @swagger
 * /blogDeactive?{id}:
 *   get:
 *     tags:
 *     - Blog 
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
blogRoutes.get("/blogDeactive", paginationMiddleware, jwt, blog.blogDeactive);

/**
 * @swagger
 * /adminRole?{id}:
 *   post:
 *     tags:
 *     - Blog 
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
blogRoutes.post("/adminRole", jwt, checkRole('superAdmin'), paginationMiddleware, blog.adminRole);

/**
 * @swagger
 * /userRole?{id}:
 *   post:
 *     tags:
 *     - Blog 
 *     summary: make blog.
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
blogRoutes.post("/userRole", jwt, checkRole('superAdmin'), paginationMiddleware, blog.userRole);

blogRoutes.get("/payment", jwt, blog.payment);
blogRoutes.get("/paypalPaymentBasic", jwt, blog.paypalPaymentBasic);
blogRoutes.get("/paypalPaymentEnterprise", jwt, blog.paypalPaymentEnterprise);
blogRoutes.get("/paypalPaymentPro", jwt, blog.paypalPaymentPro);
blogRoutes.get("/paypalsuccess", jwt, paginationMiddleware, blog.paypalsuccess);
blogRoutes.get("/paypalcancel", jwt, paginationMiddleware, blog.paypalcancel);
blogRoutes.get("/unsubscribe", jwt, paginationMiddleware, blog.unsubscribe);

export { blogRoutes };