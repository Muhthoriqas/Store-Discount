import express from 'express';
import {
  getAllProducts,
  checkout,
  getAllVouchers,
  redeemVoucher,
  getWallet,
  updateWallet,
  resetWallet,
  getTotalBuy,
  updateTotal,
  resetTotalBuy,
} from '../controllers/store.controller.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.post('/checkout', checkout);

router.get('/vouchers', getAllVouchers);
router.post('/redeem', redeemVoucher);

router.get('/wallet', getWallet);
router.put('/update/wallet', updateWallet);
router.put('/reset/wallet', resetWallet);

router.get('/total', getTotalBuy);
router.put('/update/total', updateTotal);
router.put('/reset/total', resetTotalBuy);

export default router;
