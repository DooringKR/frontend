import { Router } from "express";
import { createOrder, getOrdersByUser, getOrderById, completeOrder } from "../controllers/orderController";

const router = Router();

// POST /order — 주문 생성
router.post("/", createOrder);
router.post('/order/:order_id/complete', completeOrder);
router.get("/orders", getOrdersByUser);
router.get("/:order_id", getOrderById);

export default router;
