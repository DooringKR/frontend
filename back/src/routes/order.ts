import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { getOrdersByUser } from "../controllers/orderController";
import { getOrderById } from "../controllers/orderController";

const router = Router();

// POST /order — 주문 생성
router.post("/", createOrder);
router.get("/orders", getOrdersByUser);
router.get("/:order_id", getOrderById);

export default router;
