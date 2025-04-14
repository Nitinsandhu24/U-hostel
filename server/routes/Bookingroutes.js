import express from "express";
import { createOrder } from "../controllers/Booking.js";
import { verifyToken } from "../middleware/token.js";
import { handlePaymentSuccess } from "../controllers/Booking.js";
const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post("/payment-success", verifyToken, handlePaymentSuccess);
export default router;
