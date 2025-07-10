"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartItemController_1 = require("../controllers/cartItemController");
const router = (0, express_1.Router)();
// GET /cart_item/:cart_item_id
router.get('/:cart_item_id', cartItemController_1.getCartItem);
// POST /cart_item
router.post('/', cartItemController_1.addCartItem);
// PUT /cart_item/:cart_item_id
router.put('/:cart_item_id', cartItemController_1.updateCartItem);
// DELETE /cart_item/:cart_item_id
router.delete('/:cart_item_id', cartItemController_1.deleteCartItem);
exports.default = router;
