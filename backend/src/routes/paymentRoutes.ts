import express from 'express';
import { telebirrCallback } from '../controllers/paymentController';

const router = express.Router();

// Webhook endpoint for Telebirr servers to ping
router.route('/telebirr/callback')
  .post(telebirrCallback);

export default router;
