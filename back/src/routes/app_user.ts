import { Router } from "express";
import {
  getUserInfo,
  updateUserAddress,
} from "../controllers/appUserController";

const router = Router();

// GET /app_user/:user_id
router.get("/:user_id", getUserInfo);

// PUT /app_user/:user_id
router.put("/:user_id", updateUserAddress);

export default router;