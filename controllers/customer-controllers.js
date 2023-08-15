import { customerModel } from "../model/customer-schema.js";
import { salesModel } from "../model/sales-schema.js";

export const customerContollers = {
  createNewCustomer: async (req, res) => {
    try {
      const customerDetails = req.body.customer_details;
      const { customerName, mobileNumber } = customerDetails;
      const hasExist = await customerModel.findOne({
        customerName: customerName,
      });
      if (!hasExist) {
        customerDetails.mobileNumber = Number(mobileNumber);
        const customer = await customerModel.create(customerDetails);
        const response = {
          customerName,
          mobileNumber,
          _id: customer._id,
        };
        res.status(201).json({ status: true, customer: response });
      } else {
        res
          .status(200)
          .json({ status: false, message: "customer already exists!" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong please try again!",
      });
    }
  },

  getCustomersList: async (req, res) => {
    try {
      const customerList = await customerModel.find(
        {},
        {
          _id: 1,
          address: 1,
          mobileNumber: 1,
          customerName: 1,
        }
      );
      res.status(200).json({ customerList });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Something wen't wrong please try again` });
    }
  },

  getTransactionList: async (req, res) => {
    try {
      const transactionIist = await salesModel
        .find(
          {},
          { customerName: 1, product: 1, paymentMethod: 1, date: 1, revenue: 1 }
        )
        .populate({
          path: "customerName",
          select: "customerName _id",
        })
        .populate({
          path: "product",
          select: "name -_id",
        });

      const customers = await customerModel.find(
        {},
        { customerName: 1, _id: 1 }
      );
      res
        .status(200)
        .json({ customers: customers, transactionIist: transactionIist });
    } catch (error) {
      res.status(500).json({ message: "Something wen't wrong try again!" });
    }
  },
};
