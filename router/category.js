import express from 'express';

const categoryRoutes = express.Router();

import { getCategory, categoryAdd, categoryDataAdd, deletecategory, editcategory, categoryupdate } from "../controller/categorycontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { imagedata } from "../middelwares/images.js";

categoryRoutes.get("/category", jwt, getCategory);
categoryRoutes.post("/add_categoryData", jwt, imagedata, categoryDataAdd);
categoryRoutes.get("/category_Add", jwt, categoryAdd);
categoryRoutes.get("/delete_category", jwt, checkRole('superAdmin'), deletecategory);
categoryRoutes.get("/edit_category", jwt, checkRole('superAdmin'), editcategory);
categoryRoutes.post("/update_category", jwt, checkRole('superAdmin'), imagedata, categoryupdate);

export { categoryRoutes };
