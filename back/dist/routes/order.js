"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// POST /order — 주문 생성
router.post("/", orderController_1.createOrder);
exports.default = router;
