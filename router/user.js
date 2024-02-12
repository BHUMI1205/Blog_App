const express = require("express");

const router = express.Router();

const loginController = require("../controller/usercontroller");
const {checkRole,jwt} = require("../middelwares/jwt");

router.get("/register", loginController.register);
router.post("/userdata", loginController.userdata); 
router.get("/login", loginController.login);
router.post("/logindata", loginController.logindata);
router.get("/forgotpassword", loginController.forgotpassword);
router.post("/emailAddress", loginController.emailAddress);
router.get("/getOtp", loginController.getOtp);
router.post("/otpdata", loginController.otpdata);
router.get("/changepassword", loginController.changepassword);
router.post("/newpassword", loginController.newpassword);
router.get("/logout", loginController.logout);


router.get("/newUser",jwt,checkRole('superAdmin'), loginController.newUser);
router.post("/newUserdata",jwt,checkRole('superAdmin'), loginController.newUserdata);

module.exports = router;