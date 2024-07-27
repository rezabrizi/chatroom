// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes";

const app = express();
const corsOptions = {
  // this will be the client (front-end) URL
  origin: "http://localhost:3000",
  credentials: true,
};
// use CORS as middleware ... for requests to not get blocked
app.use(cors(corsOptions));
// ... to parse json
app.use(express.json());
// ... to parse cookies
app.use(cookieParser());

// connect to the db database
mongoose.connect("mongodb://localhost:27017/chat-app");

// set /api as the base address or the endpoints
app.use("/api", router);

export default app;
