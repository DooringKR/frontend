"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appUserController_1 = require("../controllers/appUserController");
const router = (0, express_1.Router)();
// GET /app_user/:user_id
router.get("/:user_id", appUserController_1.getUserInfo);
// PUT /app_user/:user_id
router.put("/:user_id", appUserController_1.updateUserAddress);
exports.default = router;
