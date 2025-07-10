"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
const prismaClient_1 = __importDefault(require("../prismaClient"));
// POST /order — 주문 생성
async function createOrder(req, res) {
    const { user_id, cart_id, order_type, recipient_phone, order_price, order_options, } = req.body;
    // 1) 요청 DTO 검증
    if (typeof user_id !== "number" ||
        typeof cart_id !== "number" ||
        !["DELIVERY", "PICK_UP"].includes(order_type) ||
        typeof recipient_phone !== "string" ||
        !/^[0-9]{11}$/.test(recipient_phone) ||
        typeof order_price !== "number" ||
        typeof order_options !== "object") {
        return res
            .status(400)
            .json({ message: "잘못된 주문 요청 데이터입니다." });
    }
    try {
        // 2) DB에 저장
        const order = await prismaClient_1.default.order.create({
            data: {
                user_id,
                cart_id,
                order_type,
                recipient_phone,
                order_price,
                order_options,
            },
        });
        // 3) 성공 응답
        return res.status(201).json({
            order_id: order.order_id,
            user_id: order.user_id,
            cart_id: order.cart_id,
            order_type: order.order_type,
            recipient_phone: order.recipient_phone,
            order_price: order.order_price,
            order_options: order.order_options,
            created_at: order.created_at,
        });
    }
    catch (err) {
        console.error("Order creation error:", err);
        return res
            .status(500)
            .json({ message: "서버 내부 오류로 주문을 처리할 수 없습니다." });
    }
}
