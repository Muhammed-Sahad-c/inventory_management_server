import { customerModel } from "../model/customer-schema.js";

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
};
