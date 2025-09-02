"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderItemController_1 = require("../controllers/orderItemController");
const router = (0, express_1.Router)();
// GET /order_item/:order_item_id
router.get('/:order_item_id', orderItemController_1.getOrderItem);
// POST /order_item
router.post('/', orderItemController_1.addOrderItem);
// PUT /order_item/:order_item_id
router.put('/:order_item_id', orderItemController_1.updateOrderItem);
// DELETE /order_item/:order_item_id
router.delete('/:order_item_id', orderItemController_1.deleteOrderItem);
exports.default = router;
