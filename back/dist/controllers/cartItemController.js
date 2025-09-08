"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItem = getCartItem;
exports.addCartItem = addCartItem;
exports.updateCartItem = updateCartItem;
exports.deleteCartItem = deleteCartItem;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const client_1 = require("@prisma/client");
const VALID_PRODUCT_TYPES = Object.values(client_1.ProductType);
// GET /cart_item/:cart_item_id — 특정 장바구니 아이템 조회
async function getCartItem(req, res) {
    const id = Number(req.params.cart_item_id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'cart_item_id는 정수여야 합니다' });
    }
    const item = await prismaClient_1.default.cartItem.findUnique({
        where: { id },
    });
    if (!item) {
        return res.status(404).json({ message: '해당 장바구니 아이템을 찾을 수 없습니다' });
    }
    return res.status(200).json({
        cart_item_id: item.id,
        cart_id: item.cart_id,
        product_type: item.product_type,
        unit_price: item.unit_price,
        item_count: item.item_count,
        item_options: item.item_options,
    });
}
// POST /cart_item — 장바구니에 상품 추가
async function addCartItem(req, res) {
    const { cart_id, product_type, unit_price, item_count, item_options } = req.body;
    if (typeof cart_id !== 'number' ||
        typeof item_count !== 'number' ||
        !product_type ||
        typeof unit_price !== 'number' ||
        typeof item_options !== 'object' ||
        !VALID_PRODUCT_TYPES.includes(product_type)) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }
    const newItem = await prismaClient_1.default.cartItem.create({
        data: { cart_id, product_type, unit_price, item_count, item_options },
    });
    return res.status(201).json({
        cart_item_id: newItem.id,
        cart_id: newItem.cart_id,
        product_type: newItem.product_type,
        unit_price: newItem.unit_price,
        item_count: newItem.item_count,
        item_options: newItem.item_options,
    });
}
// PUT /cart_item/:cart_item_id
async function updateCartItem(req, res) {
    const id = Number(req.params.cart_item_id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'cart_item_id는 정수여야 합니다' });
    }
    const { item_options, item_count } = req.body;
    if (typeof item_options !== 'object') {
        return res.status(400).json({ message: 'item_options는 객체여야 합니다' });
    }
    // 동시에 둘다 바꿀 수도, item_options만 바꿀 수도 있음!
    const updateData = { item_options };
    if (typeof item_count === 'number' && item_count > 0) {
        updateData.item_count = item_count;
    }
    try {
        const updated = await prismaClient_1.default.cartItem.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json({
            cart_item_id: updated.id,
            cart_id: updated.cart_id,
            product_type: updated.product_type,
            unit_price: updated.unit_price,
            item_count: updated.item_count,
            item_options: updated.item_options,
        });
    }
    catch {
        return res.status(404).json({ message: '해당 장바구니 아이템이 없습니다' });
    }
}
// DELETE /cart_item/:cart_item_id — 특정 장바구니 아이템 삭제
async function deleteCartItem(req, res) {
    const id = Number(req.params.cart_item_id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'cart_item_id는 정수여야 합니다' });
    }
    try {
        await prismaClient_1.default.cartItem.delete({ where: { id } });
        return res.sendStatus(204);
    }
    catch {
        return res.status(404).json({ message: '해당 장바구니 아이템이 없습니다' });
    }
}
