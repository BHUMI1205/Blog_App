const express = require("express");

const router = express.Router();

const blogController = require("../controller/blogcontroller");
const { checkRole, jwt } = require("../middelwares/jwt");
const paginationMiddleware = require("../middelwares/pagination");
const { multipleimageUpload } = require("../middelwares/images");


router.get("/blog", jwt, paginationMiddleware, blogController.getBlog);
router.get("/blogAdd", jwt, blogController.blogAdd);
router.post("/blogDataAdd", jwt, multipleimageUpload, blogController.blogDataAdd);
router.get("/deleteblog", jwt, blogController.deleteblog);
router.get("/editblog", jwt, blogController.editblog);
router.post("/blogupdate", jwt, multipleimageUpload, blogController.blogupdate);
router.get("/like", jwt, blogController.likes);
router.get("/unlike", jwt, blogController.unlike);
router.get("/save", jwt, blogController.save);
router.get("/unsave", jwt, blogController.unsave);
router.get("/savedblogs", paginationMiddleware, jwt, blogController.savedblogs);
router.post("/comment", jwt, blogController.comments);
router.post("/searchData", paginationMiddleware, jwt, blogController.searchData);
router.post("/DateSearchData", paginationMiddleware, jwt, blogController.DateSearchData);
router.get("/getCategoryResult", paginationMiddleware, jwt, blogController.getCategoryResult);
router.get("/userPost", paginationMiddleware, jwt, blogController.userPost);
router.get("/blogActive", paginationMiddleware, jwt, blogController.blogActive);
router.get("/blogDeactive", paginationMiddleware, jwt, blogController.blogDeactive);
router.get("/adminRole",jwt, checkRole('superAdmin'), paginationMiddleware, blogController.adminRole);
router.get("/userRole",jwt, checkRole('superAdmin'), paginationMiddleware, blogController.userRole);

module.exports = router;