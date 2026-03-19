//builds server and connects to database
import express from "express";
import { PORT } from "../config/config.service.js";
import { authenticationDB } from "./DB/index.js";
import { NotFoundException } from "./Utils/index.js";
import {
  authRouter,
  messageRouter,
  userRouter,
  otpRouter
} from "./Modules/index.js";
import { globalErrorHandling } from "./Middleware/error.middleware.js";

const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  await authenticationDB();

  app.get("/", async (req, res) => {
    res.json("Assignment-9!");
  });
  app.use("/api/auth", authRouter);
  app.use("/api/account", otpRouter);
  app.use("/api/user", userRouter);
  app.use("/api/message", messageRouter);
  app.all("{/*dummy}", async (req, res, next) => {
    NotFoundException({ message: "Route Not Found" });
  });

  app.use(globalErrorHandling);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
  return app;
};

export default bootstrap;
