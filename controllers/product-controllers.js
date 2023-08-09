import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { productModel } from "../model/product-schema.js";

const product_errMessage = `Sorry, something went wrong while creating the product. Please try again later. `;
const productFind_errMessage = `Sorry, something went wrong while getting details of the product. Please try again later.`;

export const productControllers = {
  createProduct: async (req, res) => {
    try {
      const cloudinaryDetails = await cloudinary.uploader.upload(
        req.file.path,
        {
          format: "WebP",
          // transformation: [{ width: 195, height: 195 }],
        }
      );
      fs.unlinkSync(req.file.path);
      const product_details = JSON.parse(req.body.product_details);
      const { name, description, quantity, price } = product_details;
      const data = {
        name,
        price,
        quantity,
        description,
        userId: req.body.user.id,
        imageUrl: cloudinaryDetails.secure_url,
      };
      const newProduct = await productModel.create(data);
      res.status(201).json({
        status: true,
        new_product: newProduct,
        message: "product created successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: product_errMessage });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await productModel.find(
        { userId: req.body.user.id },
        { name: 1, price: 1, imageUrl: 1, _id: 1 }
      );
      res.status(200).json({ status: true, products: products });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "something went wrong! please refresh the page",
      });
    }
  },

  getProductDetails: async (req, res) => {
    try {
      const { prod_id } = req.headers;
      const product_details = await productModel.findOne(
        { _id: prod_id },
        { userId: 0 }
      );
      res.status(200).json({
        status: true,
        message: "successfull",
        fullDetails: product_details,
      });
    } catch (error) {
      throw error;
      res.status(500).json({ status: false, message: productFind_errMessage });
    }
  },
};
