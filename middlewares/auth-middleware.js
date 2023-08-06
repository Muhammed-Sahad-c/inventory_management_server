import {} from "dotenv/config";
import jwt from "jsonwebtoken";

export const userAuthentication = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split(" ")[1];
      const jwt_secret = process.env.JSONWEBTOKEN_SECRET_KEY;
      jwt.verify(token, jwt_secret, (err, decoded) => {
        if (err) {
          res.status(401).json({ status: false, message: "token expired" });
        } else {
          req.body.user = decoded.data;
          next();
        }
      });
    } else {
      res.status(401).json({ status: false, message: `couldn't find token` });
    }
  } catch (error) {
    res.status(401).json({ status: false, message: `something wen't wrong` });
  }
};
