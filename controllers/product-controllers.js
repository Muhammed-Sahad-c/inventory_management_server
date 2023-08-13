import fs from "fs";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { productModel } from "../model/product-schema.js";

const product_errMessage = `Sorry, something went wrong while creating the product. Please try again later. `;
const productDelete_errMessage = `Sorry, something went wrong while removing the product. Please try again later.`;
const productFind_errMessage = `Sorry, something went wrong while getting details of the product. Please try again later.`;

const uploadToCloudinary = async (image_path) => {
  const cloudinaryDetails = await cloudinary.uploader.upload(image_path, {
    format: "WebP",
    // transformation: [{ width: 195, height: 195 }],
  });
  fs.unlinkSync(image_path);
  return cloudinaryDetails.secure_url;
};

export const productControllers = {
  createProduct: async (req, res) => {
    try {
      const product_details = JSON.parse(req.body.product_details);
      const { name, description, quantity, price } = product_details;
      const isExist = await productModel.findOne({
        name: name,
        available: false,
      });
      if (isExist) {
        res
          .status(200)
          .json({ status: null, message: "This product already exists." });
      } else {
        const cloudinaryDetails = await cloudinary.uploader.upload(
          req.file.path,
          {
            format: "WebP",
            // transformation: [{ width: 195, height: 195 }],
          }
        );
        fs.unlinkSync(req.file.path);
        const data = {
          name,
          price,
          quantity,
          description,
          userId: req.body.user.id,
          imageUrl: cloudinaryDetails.secure_url,
        };
        const newProduct = await productModel.create(data);
        var newProductDetails = {
          name,
          price,
          _id: newProduct._id,
          imageUrl: data.imageUrl,
        };
        res.status(201).json({
          status: true,
          new_product: newProductDetails,
          message: "product created successfully",
        });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: product_errMessage });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await productModel
        .find(
          { userId: req.body.user.id, available: false },
          { name: 1, price: 1, imageUrl: 1, _id: 1 }
        )
        .sort({ createdAt: -1 });
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
      res.status(500).json({ status: false, message: productFind_errMessage });
    }
  },

  removeAProduct: async (req, res) => {
    try {
      const { prod_id } = req.body;
      const removeProduct = await productModel.updateOne(
        { _id: prod_id },
        { available: true }
      );
      res
        .status(201)
        .json({ status: true, message: "Product removed successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: productDelete_errMessage });
    }
  },

  updateAProduct: async (req, res) => {
    try {
      const product_details = JSON.parse(req.body.edited_product_details);
      const { name, description, quantity, price, imageUrl, prod_id } =
        product_details;
      const currentId = new mongoose.Types.ObjectId(prod_id);
      const hasExist = await productModel.findOne({
        name: name,
        available: false,
        _id: { $ne: currentId },
      });

      if (!hasExist) {
        let product_imageUrl = imageUrl;
        if (product_imageUrl === undefined) {
          const cloudinaryDetails = await cloudinary.uploader.upload(
            req.file.path,
            {
              format: "WebP",
            }
          );
          fs.unlinkSync(req.file.path);
          product_imageUrl = cloudinaryDetails.secure_url;
        }

        const updatedProduct = await productModel.updateOne(
          { _id: prod_id },
          {
            name,
            description,
            price: +price,
            quantity: +quantity,
            imageUrl: product_imageUrl,
          }
        );
        res.status(201).json({ status: true, newImageUrl: product_imageUrl });
      } else {
        res.status(200).json({
          status: false,
          message: "This product is already exists",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "somthing went wrong please try again later !",
      });
    }
  },
};
