import { Router } from 'express';
import { getCart, createCart } from '../controllers/cartController';

const router = Router();

// GET /cart/:user_id
router.get('/:user_id', getCart);

// POST /cart
router.post('/', createCart);

export default router;