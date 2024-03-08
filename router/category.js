import express from 'express';

const categoryRoutes = express.Router();

import * as category from "../controller/categorycontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { imagedata } from "../middelwares/images.js";


/**
 * @swagger
 * /category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Render the category.
 *     responses:
 *       '200':
 *         description: Successfully rendered the category.
 */

categoryRoutes.get("/category", jwt, category.getCategory);

/**
 * @swagger
 * /add_categoryData:
 *   post:
 *     tags:
 *       - Category
 *     summary: add a category.
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               image:
 *                 type: file
 *               detail: 
 *                 type: string 
 *               status:
 *                 type: Number 
 *             required:
 *               - theme
 *               - image
 *               - detail
 *               - status
 *     responses:
 *       '200':
 *         description: category successfully added.
 *       '400':
 *         description: Bad request.
 */


categoryRoutes.post("/add_categoryData", jwt, imagedata, category.categoryDataAdd);


/**
 * @swagger
 * /category_Add:
 *   get:
 *     tags:
 *       - Category
 *     summary: Render the category add page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the category add page.
 */

categoryRoutes.get("/category_Add", jwt, category.categoryAdd);


/**
 * @swagger
 * /delete_category?{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: delete a category.
 *     description: Delete category
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of category to delete
 *     responses:
 *       '200':
 *         description: category successfully added.
 *       '400':
 *         description: Bad request.
 */


categoryRoutes.get("/delete_category", jwt, checkRole('superAdmin'), category.deletecategory);



/**
 * @swagger
 * /edit_category?{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Render the category edit page.
 *     parameters:
 *        - in: query 
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: string id of category to delete
 *     responses:
 *       '200':
 *         description: Successfully rendered the category edit page.
 */

categoryRoutes.get("/edit_category", jwt, checkRole('superAdmin'), category.editcategory);


/**
 * @swagger
 * /update_category?{id}:
 *   post:
 *     tags:
 *       - Category
 *     summary: update a category.
 *     description: update category
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               theme:
 *                 type: string
 *               image:
 *                 type: file
 *               detail: 
 *                 type: string 
 *               status:
 *                 type: Number
 *             required:
 *               - id
 *     responses:
 *       '200':
 *         description: category successfully updated.
 *       '400':
 *         description: Bad request.
 */

categoryRoutes.post("/update_category", jwt, checkRole('superAdmin'), imagedata, category.categoryupdate);

export { categoryRoutes };
