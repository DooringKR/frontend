import { Router } from "express";
import { signup, checkDuplicate, login } from "../controllers/authController";

const router = Router();

// POST /auth
router.post("/", signup);

// HEAD /auth?user_phone=...
router.head("/", checkDuplicate);

// POST /auth/login
router.post("/login", login);

export default router;
