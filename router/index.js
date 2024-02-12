const express = require("express");

const router = express.Router(); 

const indexController = require("../controller/indexcontroller");

const {jwt} = require("../middelwares/jwt");
const paginationMiddleware = require("../middelwares/pagination");


router.get("/",jwt,paginationMiddleware, indexController.blogPosts);
router.post("/",jwt,paginationMiddleware, indexController.blogPosts);
 

module.exports = router;
 