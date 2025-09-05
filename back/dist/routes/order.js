"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// POST /order — 주문 생성
router.post("/", orderController_1.createOrder);
router.post('/order/:order_id/complete', orderController_1.completeOrder);
router.get("/orders", orderController_1.getOrdersByUser);
router.get("/:order_id", orderController_1.getOrderById);
exports.default = router;
