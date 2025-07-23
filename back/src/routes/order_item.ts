import { Router } from 'express';
import {
  getOrderItem,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from '../controllers/orderItemController';

const router = Router();

// GET /order_item/:order_item_id
router.get('/:order_item_id', getOrderItem);

// POST /order_item
router.post('/', addOrderItem);

// PUT /order_item/:order_item_id
router.put('/:order_item_id', updateOrderItem);

// DELETE /order_item/:order_item_id
router.delete('/:order_item_id', deleteOrderItem);

export default router;
