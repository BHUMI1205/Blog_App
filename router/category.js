import express from 'express';

const categoryRoutes = express.Router();

import { getCategory, categoryAdd, categoryDataAdd, deletecategory, editcategory, categoryupdate } from "../controller/categorycontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { imagedata } from "../middelwares/images.js";



/**
 * @swagger
 * /category:
 *   get:
 *     summary: Render the category.
 *     responses:
 *       '200':
 *         description: Successfully rendered the category.
 */

categoryRoutes.get("/category", jwt, getCategory);

/**
 * @swagger
 * /add_categoryData:
 *   post:
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


categoryRoutes.post("/add_categoryData", jwt, imagedata, categoryDataAdd);


/**
 * @swagger
 * /category_Add:
 *   get:
 *     summary: Render the category add page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the category add page.
 */

categoryRoutes.get("/category_Add", jwt, categoryAdd);


/**
 * @swagger
 * /delete_category?{id}:
 *   get:
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


categoryRoutes.get("/delete_category", jwt, checkRole('superAdmin'), deletecategory);



/**
 * @swagger
 * /edit_category?{id}:
 *   get:
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

categoryRoutes.get("/edit_category", jwt, checkRole('superAdmin'), editcategory);


/**
 * @swagger
 * /update_category?{id}:
 *   post:
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

categoryRoutes.post("/update_category", jwt, checkRole('superAdmin'), imagedata, categoryupdate);

export { categoryRoutes };
