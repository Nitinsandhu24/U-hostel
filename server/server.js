import express from "express";
import dotenv from "dotenv";
import pool from "./database.js";
import userRouter from "./routes/UserRouter.js";
import gatepassRouter from "./routes/gatePassRoutes.js";
import cors from "cors";
import Fine from "./routes/FineRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow requests from frontend only
    credentials: true, // ✅ Allow cookies if using authentication
  })
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/gatepass", gatepassRouter);
app.use("/api/fine", Fine);
app.listen(PORT, () => {
  console.log("Running on PORT " + PORT);
});
