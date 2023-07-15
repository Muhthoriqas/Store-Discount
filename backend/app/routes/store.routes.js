import express from 'express';
import {
  getAllVouchers,
  getVoucherById,
  checkout,
  getAllProducts,
  redeemVoucher,
  getWallet,
  resetWallet,
} from '../controllers/store.controller.js';

const router = express.Router();

router.get('/vouchers', getAllVouchers);
router.post('/redeem', redeemVoucher);
router.get('/vouchers/:id', getVoucherById);
router.get('/products', getAllProducts);
router.post('/checkout', checkout);
router.get('/wallet', getWallet);
router.put('/reset/wallet', resetWallet);

export default router;
