import mongoose from "mongoose";
import { salesModel } from "../model/sales-schema.js";
import { productModel } from "../model/product-schema.js";
import { customerModel } from "../model/customer-schema.js";

export const reportControllers = {
  getSalesFormDetails: async (req, res) => {
    try {
      const products = await productModel.find(
        { available: false, stock: false },
        { _id: 1, name: 1, quantity: 1 }
      );

      const customers = await customerModel.find(
        {},
        { _id: 1, customerName: 1 }
      );

      res.status(200).json({ status: true, products, customers });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something wen't wrong try again later" });
      throw error;
    }
  },

  createNewSales: async (req, res) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { customerName, quantity, product, date, paymentMethod } =
        req.body.data;

      const product_details = await productModel.findOne({ _id: product });

      const salesData = {
        date,
        product,
        quantity,
        customerName,
        paymentMethod,
        revenue: product_details.price * quantity,
      };

      const updatedSaleDetails = await salesModel.create(salesData);

      product_details.quantity -= quantity;
      product_details.purchasedCount += 1;
      product_details.sold += quantity;
      if (product_details.quantity === 0) {
        product_details.stock = true;
      }

      await product_details.save();

      const response = {
        _id: product_details._id,
        name: product_details.name,
        price: product_details.price,
        quantity: product_details.quantity,
        totalSales: product_details.sold,
        purchasedCount: product_details.purchasedCount,
        totalRevenue: product_details.price * product_details.sold,
      };

      res.status(201).json({ status: true, updatedDataObj: response });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: "Something wen't wrong" });
    } finally {
      session.endSession();
    }
  },

  getInventoryReports: async (req, res) => {
    try {
      const itemsReport = await productModel.aggregate([
        {
          $project: {
            sold: 1,
            name: 1,
            price: 1,
            quantity: 1,
            purchasedCount: 1,
          },
        },
        {
          $addFields: {
            totalSales: "$sold",
            totalRevenue: { $multiply: ["$sold", "$price"] },
          },
        },
        {
          $project: {
            sold: 0,
          },
        },
      ]);
      res.status(200).json({ itemsReport });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong try again!" });
    }
  },

  getSalesReports: async (req, res) => {
    try {
      const details = await salesModel
        .find({}, { createdAt: 0, updatedAt: 0, __v: 0 })
        .populate({
          path: "customerName",
          select: "customerName -_id",
        })
        .populate({
          path: "product",
          select: "name price -_id",
        });
      res.status(200).json({ details });
    } catch (error) {
      res.status(500).json({ message: `Something wen't wrong try again` });
    }
  },
};
