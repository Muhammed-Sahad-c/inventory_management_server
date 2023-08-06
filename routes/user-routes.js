import express from "express";
export const router = express.Router();
import { authController } from "../controllers/auth-controller.js";
import { userAuthentication as authUser } from "../middlewares/auth-middleware.js";

router.get("/login", authController.validateLoginDetails);
router.get("/getuserdetails", authUser, authController.getUserDetails);
