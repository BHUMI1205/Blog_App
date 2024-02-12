const express = require("express");

const router = express.Router();

const categoryController = require("../controller/categorycontroller");
const { imagedata } = require("../middelwares/images");
const { checkRole, jwt } = require("../middelwares/jwt");


router.get("/category", jwt, categoryController.getCategory);
router.post("/categoryDataAdd", jwt, imagedata, categoryController.categoryDataAdd);
router.get("/categoryAdd", jwt, categoryController.categoryAdd);
router.get("/deletecategory", jwt, checkRole('superAdmin'), categoryController.deletecategory);
router.get("/editcategory", jwt, checkRole('superAdmin'), categoryController.editcategory);
router.post("/categoryupdate",jwt, checkRole('superAdmin'),imagedata,categoryController.categoryupdate);

module.exports = router;
