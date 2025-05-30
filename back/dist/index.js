"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orderHandler_1 = require("./orderHandler");
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)({
    origin: 'https://dooringkr.vercel.app/login',
    credentials: true
}));
app.use(express_1.default.json());
app.post('/order', orderHandler_1.handleOrderRequest);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
