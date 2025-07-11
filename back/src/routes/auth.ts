import { Router } from "express";
import { signup, checkDuplicate } from "../controllers/authController";

const router = Router();

// POST /auth
router.post("/", signup);

// HEAD /auth?user_phone=...
router.head("/", checkDuplicate);

export default router;
