"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const app_user_1 = __importDefault(require("./routes/app_user"));
const order_1 = __importDefault(require("./routes/order"));
const cart_1 = __importDefault(require("./routes/cart"));
const cart_item_1 = __importDefault(require("./routes/cart_item"));
const order_item_1 = __importDefault(require("./routes/order_item"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3001", 10);
app.use((0, cors_1.default)({
    origin: [
        'https://dooringkr.vercel.app/login',
        'http://localhost:3000'
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/images', (0, cors_1.default)(), express_1.default.static(path_1.default.join(__dirname, '../public/images')));
app.use('/img', (0, cors_1.default)(), express_1.default.static(path_1.default.join(__dirname, '../public/img')));
app.use('/auth', auth_1.default);
app.use('/order', order_1.default);
app.use('/app_user', app_user_1.default);
app.use('/cart', cart_1.default);
app.use('/cart_item', cart_item_1.default);
app.use('/order_item', order_item_1.default);
// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('▶ process.env.PORT =', process.env.PORT);
});
