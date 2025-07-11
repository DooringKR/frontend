import { Router } from 'express';
import {
  getCartItem,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from '../controllers/cartItemController';

const router = Router();

// GET /cart_item/:cart_item_id
router.get('/:cart_item_id', getCartItem);

// POST /cart_item
router.post('/', addCartItem);

// PUT /cart_item/:cart_item_id
router.put('/:cart_item_id', updateCartItem);

// DELETE /cart_item/:cart_item_id
router.delete('/:cart_item_id', deleteCartItem);

export default router;