import express from "express";
import { verifyToken, checkRole } from "../middleware/token.js";
import { Finepad, getallfines, ImposeFine } from "../controllers/ImposeFine.js";
const router = express.Router();

router.post("/imposefine", verifyToken, ImposeFine);
router.get("/allfines/:student_id", verifyToken, getallfines);
router.put("/updatestatus/:fineid", verifyToken, Finepad);
export default router;
