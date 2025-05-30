"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderRequest = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
const handleOrderRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.body;
    // 1. 주문자 및 수령자 정보 검증
    if (!order.user || !order.recipientPhoneNumber || !order.address1 || !order.deliveryDate) {
        return res.status(400).json({ success: false, message: '필수 정보 누락' });
    }
    // 2. cartItems 검사 및 가격 계산
    let calculatedTotal = 0;
    let itemCount = 0;
    for (const item of order.cartItems) {
        if (!item.category || !item.price || !item.count) {
            return res.status(400).json({ success: false, message: '제품 정보 누락' });
        }
        calculatedTotal += item.price;
        itemCount += item.count;
    }
    // 3. 총 가격 검증
    if (order.totalPrice !== calculatedTotal) {
        return res.status(422).json({ success: false, message: '가격 불일치' });
    }
    try {
        // 4. Prisma를 통한 주문 정보 저장
        const savedOrder = yield prismaClient_1.default.order.create({
            data: {
                userId: order.user.id,
                userType: order.user.userType,
                userPhone: order.user.phoneNumber,
                recipientPhone: order.recipientPhoneNumber,
                address1: order.address1,
                address2: order.address2,
                deliveryDate: new Date(order.deliveryDate),
                deliveryRequest: order.deliveryRequest,
                otherRequests: order.otherRequests,
                totalPrice: calculatedTotal,
                itemCount: itemCount
            }
        });
        return res.status(200).json({
            success: true,
            orderId: savedOrder.id,
            totalPrice: savedOrder.totalPrice,
            itemCount: savedOrder.itemCount,
            estimatedDeliveryDate: savedOrder.deliveryDate.toISOString().split('T')[0],
            message: '주문이 성공적으로 접수되었습니다.'
        });
    }
    catch (error) {
        console.error('DB 저장 오류:', error);
        return res.status(500).json({ success: false, message: '서버 내부 오류' });
    }
});
exports.handleOrderRequest = handleOrderRequest;
