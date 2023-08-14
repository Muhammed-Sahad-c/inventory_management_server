import express from "express";
import upload from "../middlewares/multer-fileupload.js";
import { authController } from "../controllers/auth-controller.js";
import { productControllers } from "../controllers/product-controllers.js";
import { customerContollers } from "../controllers/customer-controllers.js";
import { userAuthentication as authUser } from "../middlewares/auth-middleware.js";

export const router = express.Router();

router.get("/login", authController.validateLoginDetails);
router.get("/getuserdetails", authUser, authController.getUserDetails);

// product controllers
router.post(
  "/createproduct",
  upload.single("file"),
  authUser,
  productControllers.createProduct
);
router.get("/getproducts", authUser, productControllers.getAllProducts);
router.get(
  "/getproductdetails",
  authUser,
  productControllers.getProductDetails
);

router.post("/removeproduct", authUser, productControllers.removeAProduct);
router.post(
  "/updateproduct",
  upload.single("file"),
  authUser,
  productControllers.updateAProduct
);

// customer routes
router.post("/createcustomer", authUser, customerContollers.createNewCustomer);
router.get("/getcustomerlist", authUser, customerContollers.getCustomersList);
