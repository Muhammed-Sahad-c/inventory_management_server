import cors from "cors";
import express from "express";
import {} from "dotenv/config";
import bodyParser from "body-parser";
import { connectToDataBase } from "./config/database.js";
import { router as userRouter } from "./routes/user-routes.js";

const server = express();

server.use(
  cors({
    origin: process.env.CLIENT_SIDE_URL,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const port = process.env.PORT;

server.use(express.json());
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));

server.use("/", userRouter);

server.listen(port, () => {
  console.log("server started.....");
  console.log(`running on port ${port}....`);
  connectToDataBase();
});
