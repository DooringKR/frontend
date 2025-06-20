"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orderHandler_1 = require("./orderHandler");
const authHandler_1 = require("./authHandler");
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)({
    origin: 'https://dooringkr.vercel.app/login',
    credentials: true
}));
app.use(express_1.default.json());
app.post('/order', orderHandler_1.handleOrderRequest);
app.post('/api/auth/signin', authHandler_1.handleSignIn);
app.post('/api/auth/signup', authHandler_1.handleSignUp);
app.get('/api/auth/user', authHandler_1.handleUserInfo);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
