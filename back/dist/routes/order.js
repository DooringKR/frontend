"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const orderController_2 = require("../controllers/orderController");
const orderController_3 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// POST /order — 주문 생성
router.post("/", orderController_1.createOrder);
router.get("/orders", orderController_2.getOrdersByUser);
router.get("/:order_id", orderController_3.getOrderById);
exports.default = router;
