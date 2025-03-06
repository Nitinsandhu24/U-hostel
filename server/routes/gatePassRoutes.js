import {
  gate_pass_apply,
  getallgatepass,
} from "../controllers/gatepass_apply.js";
import { gate_pass_approval, getAllPendingGatePasses } from "../controllers/gatepass_approval.js";
import express from "express";
import { verifyToken, checkRole } from "../middleware/token.js";
const router = express.Router();

router.post(
  "/gate_pass_apply",
  verifyToken,
  checkRole("student"),
  gate_pass_apply
);
router.post(
  "/gate_pass_approval",
  verifyToken,
  checkRole("admin"),
  gate_pass_approval
);
router.get("/getallgatepass", verifyToken, getallgatepass);
router.get("/getallpending",verifyToken, getAllPendingGatePasses);
export default router;
