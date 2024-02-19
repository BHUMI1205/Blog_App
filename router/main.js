import express from 'express';

const routes = express.Router();

import { blogPosts } from "../controller/indexcontroller.js";

import { jwt } from "../middelwares/jwt.js";
import {paginationMiddleware} from "../middelwares/pagination.js";


routes.get("/", jwt, paginationMiddleware, blogPosts);
routes.post("/", jwt, paginationMiddleware, blogPosts);


export { routes };