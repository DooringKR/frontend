"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderRequest = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
const handleOrderRequest = async (req, res) => {
    const order = req.body;
    // 1. 기본 필수 필드 검증
    if (!order.user ||
        !order.user.id ||
        !order.user.userType ||
        !order.user.phoneNumber ||
        !order.recipientPhoneNumber ||
        !order.address1 ||
        !order.address2 ||
        !order.foyerAccessType ||
        !order.foyerAccessType.type ||
        !order.deliveryDate ||
        !order.deliveryRequest ||
        !order.otherRequests ||
        !Array.isArray(order.cartItems) ||
        order.cartItems.length === 0 ||
        order.totalPrice == null) {
        return res.status(400).json({ success: false, message: '필수 정보 누락' });
    }
    // foyerAccessType이 gate일 때 password 검증
    if (order.foyerAccessType.type === 'gate' &&
        !order.foyerAccessType.gatePassword) {
        return res.status(400).json({ success: false, message: 'gatePassword 필요' });
    }
    // 2. 가격 및 개수 계산
    let calculatedTotal = 0;
    let itemCount = 0;
    for (const item of order.cartItems) {
        if (!item.category || item.count == null || item.price == null) {
            return res.status(400).json({ success: false, message: 'cartItem 정보 누락' });
        }
        calculatedTotal += item.price * item.count;
        itemCount += item.count;
    }
    // 3. 총 가격 검증
    if (order.totalPrice !== calculatedTotal) {
        return res.status(422).json({ success: false, message: '가격 불일치' });
    }
    try {
        // 4. Order 테이블에 저장
        const orderRecord = await prismaClient_1.default.order.create({
            data: {
                userId: order.user.id,
                userType: order.user.userType,
                userPhone: order.user.phoneNumber,
                recipientPhone: order.recipientPhoneNumber,
                address1: order.address1,
                address2: order.address2,
                foyerType: order.foyerAccessType.type,
                gatePassword: order.foyerAccessType.type === 'gate'
                    ? order.foyerAccessType.gatePassword
                    : null,
                deliveryDate: new Date(order.deliveryDate),
                deliveryRequest: order.deliveryRequest,
                otherRequests: order.otherRequests,
                totalPrice: calculatedTotal,
                itemCount: itemCount,
            },
        });
        // 5. 각 category별로 별도 테이블에 저장
        for (const item of order.cartItems) {
            switch (item.category) {
                case 'door':
                    await prismaClient_1.default.doorItem.create({
                        data: {
                            orderId: orderRecord.id,
                            slug: item.slug,
                            color: item.color,
                            width: item.width,
                            height: item.height,
                            hingeCount: item.hinge.hingeCount,
                            hingeSide: item.hinge.hingePosition,
                            topHinge: item.hinge.topHinge,
                            bottomHinge: item.hinge.bottomHinge,
                            middleHinge: item.hinge.middleHinge,
                            middleTopHinge: item.hinge.middleTopHinge,
                            middleBottomHinge: item.hinge.middleBottomHinge,
                            doorRequest: item.doorRequest,
                            count: item.count,
                            price: item.price,
                        },
                    });
                    break;
                case 'finish':
                    await prismaClient_1.default.finishItem.create({
                        data: {
                            orderId: orderRecord.id,
                            color: item.color,
                            baseDepth: item.depth.baseDepth,
                            additionalDepth: item.depth.additionalDepth,
                            baseHeight: item.height.baseHeight,
                            additionalHeight: item.height.additionalHeight,
                            finishRequest: item.finishRequest,
                            count: item.count,
                            price: item.price,
                        },
                    });
                    break;
                case 'cabinet':
                    await prismaClient_1.default.cabinetItem.create({
                        data: {
                            orderId: orderRecord.id,
                            slug: item.slug,
                            color: item.color,
                            handleType: item.handleType,
                            compartmentCount: item.compartmentCount,
                            flapStayType: item.flapStayType,
                            material: item.material,
                            thickness: item.thickness,
                            width: item.width,
                            height: item.height,
                            depth: item.depth,
                            option: JSON.stringify(item.option),
                            finishType: item.finishType,
                            drawerType: item.drawerType,
                            railType: item.railType,
                            orderRequests: item.orderRequests,
                            count: item.count,
                            price: item.price,
                        },
                    });
                    break;
                case 'accessory':
                    await prismaClient_1.default.accessoryItem.create({
                        data: {
                            orderId: orderRecord.id,
                            slug: item.slug,
                            madeBy: item.madeBy,
                            model: item.model,
                            orderRequests: item.orderRequests,
                            count: item.count,
                            price: item.price,
                        },
                    });
                    break;
                case 'hardware':
                    await prismaClient_1.default.hardwareItem.create({
                        data: {
                            orderId: orderRecord.id,
                            slug: item.slug,
                            madeBy: item.madeBy,
                            model: item.model,
                            orderRequests: item.orderRequests,
                            count: item.count,
                            price: item.price,
                        },
                    });
                    break;
                default:
                    // 알려지지 않은 category 무시
                    break;
            }
        }
        // 6. 응답 반환
        return res.status(200).json({
            success: true,
            orderId: orderRecord.id,
            totalPrice: calculatedTotal,
            itemCount: itemCount,
            estimatedDeliveryDate: orderRecord.deliveryDate
                .toISOString()
                .split('T')[0],
            message: '주문이 성공적으로 접수되었습니다.',
        });
    }
    catch (error) {
        console.error('DB 저장 오류:', error);
        return res.status(500).json({ success: false, message: '서버 내부 오류' });
    }
};
exports.handleOrderRequest = handleOrderRequest;
