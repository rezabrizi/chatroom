import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes";

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/chat-app");

app.use("/api", router);

export default app;
