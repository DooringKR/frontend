"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST /auth
router.post("/", authController_1.signup);
// HEAD /auth?user_phone=...
router.head("/", authController_1.checkDuplicate);
exports.default = router;
