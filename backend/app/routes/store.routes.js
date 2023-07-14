import express from 'express';
import {
  getAllVouchers,
  getVoucherById,
  checkout,
  getAllProducts,
  redeemVoucher,
} from '../controllers/store.controller.js';

const router = express.Router();

router.get('/vouchers', getAllVouchers);
router.get('/vouchers/:id', getVoucherById);
router.get('/products', getAllProducts);
router.post('/checkout', checkout);
router.post('/redeem', redeemVoucher);

export default router;
