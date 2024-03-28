import express from 'express';

const categoryRoutes = express.Router();

import * as category from "../controller/categorycontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { imagedata } from "../middelwares/images.js";

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
categoryRoutes.get("/category_Add", jwt, category.categoryAdd);

/**
 * @swagger
 * /delete_category?{id}:
 *   delete:
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
categoryRoutes.delete("/delete_category", jwt, checkRole('superAdmin'), category.deletecategory);
categoryRoutes.get("/edit_category", jwt, checkRole('superAdmin'), category.editcategory);

/**
 * @swagger
 * /update_category?{id}:
 *   put:
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
categoryRoutes.put("/update_category", jwt, checkRole('superAdmin'), imagedata, category.categoryupdate);

export { categoryRoutes };
