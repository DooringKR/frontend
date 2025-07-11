import { Router } from "express";
import { createOrder } from "../controllers/orderController";

const router = Router();

// POST /order — 주문 생성
router.post("/", createOrder);

export default router;
