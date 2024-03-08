import express from 'express';

const userRoutes = express.Router();

import * as user from "../controller/usercontroller.js";
import { checkRole, jwt } from "../middelwares/jwt.js";
import { paginationMiddleware } from "../middelwares/pagination.js";

/**
 * @swagger
 * /register:
 *   get:
 *     tags:
 *       - User
 *     summary: Render the registration page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the registration page.
 * /userdata:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user. 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 formate: email
 *               password:
 *                 type: string
 *                 formate: password
 *               cpassword:
 *                 type: string
 *                 formate: password
 *             required:
 *               - fname
 *               - lname
 *               - username
 *               - email
 *               - password
 *               - cpassword
 *     responses:
 *       '200':
 *         description: User successfully registered.
 *       '400':
 *         description: Bad request.
 */

userRoutes.get("/register", user.register);
userRoutes.post("/userdata", user.userdata);

/**
 * @swagger
 * /login:
 *   get:
 *     tags:
 *       - User
 *     summary: Render the login page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the login page.
 * /logindata:
 *   post:
 *     tags:
 *       - User
 *     summary: Log in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 formate: email
 *               password:
 *                 type: string
 *                 formate: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User successfully logged in.
 *       '400':
 *         description: Bad request.
 */

userRoutes.get("/login", user.login);
userRoutes.post("/logindata", user.logindata);

/**
 * @swagger
 * /forgot_password:
 *   get:
 *     tags:
 *       - User
 *     summary: Render the forgot password page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the forgot password page.
 * /email_address:
 *   post:
 *     tags:
 *       - User
 *     summary: Send an email for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema: 
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 formate: email
 *             required:
 *               - email 
 *     responses:
 *       '200':
 *         description: Password reset email sent successfully.
 *       '400':
 *         description: Bad request.
 */

userRoutes.get("/forgot_password", user.forgotpassword);
userRoutes.post("/email_address", user.emailAddress);

/**
 * @swagger
 * /getOtp:
 *   get:
 *     tags:
 *       - User
 *     summary: Render the OTP verification page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the OTP verification page.
 * /otpdata:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify the OTP sent for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *             required:
 *               - otp
 *     responses:
 *       '200':
 *         description: OTP verified successfully.
 *       '400':
 *         description: Bad request.
 */

userRoutes.get("/getOtp", user.getOtp);
userRoutes.post("/otpdata", user.otpdata);

/**
 * @swagger
 * /change_password:
 *   get:
 *     tags:
 *       - User
 *     summary: Render the change password page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the change password page.
 * /new_password:
 *   post:
 *     tags:
 *       - User
 *     summary: Change user password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string 
 *                 formate: password
 *               cpassword:
 *                 type: string
 *                 formate: password
 *             required:
 *               - password
 *               - cpassword
 *     responses:
 *       '200':
 *         description: Password changed successfully.
 *       '400':
 *         description: Bad request.
 */

userRoutes.get("/change_password", user.changepassword);
userRoutes.post("/new_password", user.newpassword);


/**
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *       - User
 *     summary: logout from app.
 *     responses:
 *       '200':
 *         description: Successfully logout frm app.
 */

userRoutes.get("/logout", user.logout);
/**
 * @swagger
 * /newUser:
 *   get:
 *     tags:
 *       - User
 *     summary: Render the new user registration page.
 *     responses:
 *       '200':
 *         description: Successfully rendered the new user registration page.
 * /newUserdata:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user by an admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object 
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 formate: email
 *               role:
 *                 type: string
 *             required:
 *               - fname
 *               - lname
 *               - username
 *               - email
 *               - role
 *     responses:
 *       '200':
 *         description: User successfully registered by an admin.
 *       '400':
 *         description: Bad request.
 */

userRoutes.get("/newUser", jwt, checkRole('superAdmin'), user.newUser);
userRoutes.post("/newUserdata", jwt, checkRole('superAdmin'), user.newUserdata);

userRoutes.post("/msg-ai", jwt, paginationMiddleware, user.msgToAI);

export { userRoutes };