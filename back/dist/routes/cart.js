"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const router = (0, express_1.Router)();
// GET /cart/:user_id
router.get('/:user_id', cartController_1.getCart);
// POST /cart
router.post('/', cartController_1.createCart);
exports.default = router;
