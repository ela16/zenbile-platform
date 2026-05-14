import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
