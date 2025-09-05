"use strict";
// src/controllers/orderItemController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderItem = getOrderItem;
exports.addOrderItem = addOrderItem;
exports.updateOrderItem = updateOrderItem;
exports.deleteOrderItem = deleteOrderItem;
const prismaClient_1 = __importDefault(require("../prismaClient"));
// ProductType enum 직접 명시
// import { generateAndUploadOrderItemImage } from '../services/imageService';
const VALID_PRODUCT_TYPES = ["DOOR", "FINISH", "CABINET", "HARDWARE", "ACCESSORY"];
// GET /order_item/:order_item_id — 특정 주문 아이템 조회
async function getOrderItem(req, res) {
    const id = Number(req.params.order_item_id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
    }
    const item = await prismaClient_1.default.orderItem.findUnique({
        where: { order_item_id: id },
    });
    if (!item) {
        return res.status(404).json({ message: '해당 주문 아이템을 찾을 수 없습니다' });
    }
    return res.status(200).json({
        order_item_id: item.order_item_id,
        order_id: item.order_id,
        product_type: item.product_type,
        unit_price: item.unit_price,
        item_count: item.item_count,
        item_options: item.item_options,
        image_url: item.image_url,
    });
}
// POST /order_item — 주문에 아이템 추가
async function addOrderItem(req, res) {
    console.log('[NotionSync][TRACE][orderItemController] addOrderItem 함수 진입', { body: req.body });
    // ...existing code...
    const { order_id, product_type, unit_price, item_count, item_options } = req.body;
    if (!order_id ||
        !VALID_PRODUCT_TYPES.includes(product_type) ||
        typeof unit_price !== 'number' ||
        typeof item_count !== 'number' ||
        typeof item_options !== 'object') {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }
    // 이미지 생성 및 업로드
    /*let image_url: string | null = null;
    try {
      image_url = await generateAndUploadOrderItemImage({ product_type, item_options });
      console.log('[OrderItem][TRACE] 이미지 생성/업로드 결과', { image_url });
    } catch (e) {
      console.warn('[OrderItem][WARN] 이미지 생성/업로드 실패', e);
    } */
    const newItem = await prismaClient_1.default.orderItem.create({
        data: {
            order_id,
            product_type,
            unit_price,
            item_count,
            item_options,
            image_url: undefined,
        },
    });
    return res.status(201).json({
        order_item_id: newItem.order_item_id,
        order_id: newItem.order_id,
        product_type: newItem.product_type,
        unit_price: newItem.unit_price,
        item_count: newItem.item_count,
        item_options: newItem.item_options,
        image_url: newItem.image_url,
    });
}
// PUT /order_item/:order_item_id
async function updateOrderItem(req, res) {
    const id = Number(req.params.order_item_id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
    }
    const { item_options, item_count, image_url } = req.body;
    if (typeof item_options !== 'object') {
        return res.status(400).json({ message: 'item_options는 객체여야 합니다' });
    }
    const updateData = { item_options };
    if (typeof item_count === 'number' && item_count > 0) {
        updateData.item_count = item_count;
    }
    if (typeof image_url === 'string' && image_url.length > 0) {
        updateData.image_url = image_url;
    }
    try {
        const updated = await prismaClient_1.default.orderItem.update({
            where: { order_item_id: id },
            data: updateData,
        });
        return res.status(200).json({
            order_item_id: updated.order_item_id,
            order_id: updated.order_id,
            product_type: updated.product_type,
            unit_price: updated.unit_price,
            item_count: updated.item_count,
            item_options: updated.item_options,
        });
    }
    catch {
        return res.status(404).json({ message: '해당 주문 아이템이 없습니다' });
    }
}
// DELETE /order_item/:order_item_id — 특정 주문 아이템 삭제
async function deleteOrderItem(req, res) {
    const id = Number(req.params.order_item_id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
    }
    try {
        await prismaClient_1.default.orderItem.delete({ where: { order_item_id: id } });
        return res.sendStatus(204);
    }
    catch {
        return res.status(404).json({ message: '해당 주문 아이템이 없습니다' });
    }
}
