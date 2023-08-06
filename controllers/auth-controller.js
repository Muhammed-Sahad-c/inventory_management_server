import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user-schema.js";

const saltRounds = 10;
const message_badRequest = `something wen't wrong!`;
const message_resultNull = `couldn't find email`;

const createToken = (data, exp_time) => {
  return jwt.sign({ data }, process.env.JSONWEBTOKEN_SECRET_KEY, {
    expiresIn: exp_time,
  });
};

export const authController = {
  validateLoginDetails: async (req, res) => {
    try {
      const { email, password } = req.headers;
      const userDetails = await userModel.findOne({ email: email });
      if (userDetails) {
        const comparePasswords = await bcrypt.compare(
          password,
          userDetails.password
        );
        if (comparePasswords) {
          const token = createToken(
            { email, id: userDetails._id, userName: userDetails.userName },
            "1d"
          );
          const response = {
            token,
            status: true,
            message: "login successfull",
          };
          res.status(200).json(response);
        } else {
          res.status(200).json({ status: false, message: message_resultNull });
        }
      } else {
        res.status(200).json({ status: false, message: message_resultNull });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: message_badRequest });
      throw error;
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const token = createToken(req.body.user, "1d");
      res.status(200).json({
        token,
        status: true,
        message: "successfull",
        userData: req.body.user,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: message_badRequest });
    }
  },
};
