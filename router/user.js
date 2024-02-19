import express from 'express';

const userRoutes = express.Router();

import { register, userdata, login, logindata, forgotpassword, emailAddress, getOtp, otpdata, changepassword, newpassword, logout, newUser, newUserdata } from "../controller/usercontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";

userRoutes.get("/register", register);
userRoutes.post("/userdata", userdata);
userRoutes.get("/login", login);
userRoutes.post("/logindata", logindata);
userRoutes.get("/forgot_password", forgotpassword);
userRoutes.post("/email_address", emailAddress);
userRoutes.get("/getOtp", getOtp);
userRoutes.post("/otpdata", otpdata);
userRoutes.get("/change_password", changepassword);
userRoutes.post("/new_password", newpassword);
userRoutes.get("/logout", logout);


userRoutes.get("/newUser", jwt, checkRole('superAdmin'), newUser);
userRoutes.post("/newUserdata", jwt, checkRole('superAdmin'), newUserdata);

export { userRoutes };