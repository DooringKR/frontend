import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { getOrdersByUser } from "../controllers/orderController";

const router = Router();

// POST /order — 주문 생성
router.post("/", createOrder);
router.get("/orders", getOrdersByUser);

export default router;
