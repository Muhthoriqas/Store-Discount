import admin from 'firebase-admin';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import db from '../config/firebase.config.js';
import { badResponse, successResponse } from '../utils/response.js';

export const getAllProducts = async (req, res) => {
  try {
    const productSnapshoot = await db.collection('product').get();
    const products = productSnapshoot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const getProductsById = async (req, res) => {
  try {
    const productId = req.params.id;
    const productDoc = await db.collection('vouchers').doc(productId).get();
    if (!productDoc.exists) {
      res.status(404).send('Voucher tidak ditemukan.');
      return;
    }
    const productData = productDoc.data();
    return res.json({ id: productDoc.id, ...productData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

// Endpoint untuk berbelanja dan mendapatkan voucher
export const checkout = async (req, res) => {
  try {
    const { totalBuy } = req.body;

    const date = new Date();
    const tanggalTransaksi = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const transactionData = {
      totalBuy,
      tanggalTransaksi,
    };

    if (totalBuy >= 2000000 && totalBuy % 2000000 === 0) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);

      const formattedExpiresAt = `${expiresAt.getDate()}-${
        expiresAt.getMonth() + 1
      }-${expiresAt.getFullYear()} ${expiresAt.getHours()}:${expiresAt.getMinutes()}:${expiresAt.getSeconds()}`;

      const voucherData = {
        voucherValue: 10000,
        expiresAt: formattedExpiresAt,
      };

      const newVoucherRef = await db.collection('vouchers').add(voucherData);
      const newVoucherId = newVoucherRef.id;

      await db
        .collection('vouchers')
        .doc(newVoucherId)
        .update({ id: newVoucherId });

      const newVoucherData = {
        id: newVoucherId,
        ...voucherData,
      };

      return res.status(201).json({ ...newVoucherData, ...transactionData });
    }

    await db.collection('transactions').add(transactionData);

    return res.status(201).json(transactionData);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi kesalahan server.');
  }
};

export const redeemVoucher = async (req, res) => {
  try {
    const { voucherId } = req.body;

    const voucherSnapshot = await db
      .collection('vouchers')
      .where('id', '==', voucherId)
      .get();

    if (voucherSnapshot.empty) {
      console.error('tidak valid');
      return res.status(404).send('Voucher tidak valid.');
    }

    const walletSnapshot = await db.collection('wallet').get();
    const walletDoc = walletSnapshot.docs[0].ref;
    const walletData = walletSnapshot.docs[0].data();
    let walletValue = walletData.walletValue;

    const voucherDoc = voucherSnapshot.docs[0];
    const voucherData = voucherDoc.data();
    const expiresAt = voucherData.expiresAt;

    const currentDate = new Date();
    const isExpired = currentDate > new Date(expiresAt);

    if (isExpired) {
      return res.status(400).send('Voucher telah kadaluarsa.');
    }

    const voucherValue = voucherData.voucherValue;
    walletValue += voucherValue;

    await Promise.all([
      voucherDoc.ref.delete(),
      walletDoc.update({ walletValue }),
    ]);

    return res.status(200).json({
      message: 'Voucher berhasil digunakan. Lihat wallet mu di dashboard yuk!',
      voucherValue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi kesalahan server.');
  }
};

// Mengambil semua voucher
export const getAllVouchers = async (req, res) => {
  try {
    const snapshot = await db.collection('vouchers').get();
    const vouchers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

// Mengambil voucher berdasarkan ID
export const getVoucherById = async (req, res) => {
  try {
    const voucherId = req.params.id;
    const voucherDoc = await db.collection('vouchers').doc(voucherId).get();
    if (!voucherDoc.exists) {
      res.status(404).send('Voucher tidak ditemukan.');
      return;
    }
    const voucherData = voucherDoc.data();
    return res.json({ id: voucherDoc.id, ...voucherData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const getWallet = async (req, res) => {
  try {
    const snapshot = await db.collection('wallet').get();
    const wallet = snapshot.docs[0].data();
    const walletValue = wallet.walletValue;

    const response = { walletValue };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const updateWallet = async (req, res) => {
  try {
    const { walletValue } = req.body;

    const snapshot = await db.collection('wallet').get();
    const wallet = snapshot.docs[0].ref;
    const updateData = { walletValue: walletValue };
    await wallet.update(updateData);

    return res.status(200).json(updateData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const resetWallet = async (req, res) => {
  try {
    const snapshot = await db.collection('wallet').get();
    const wallet = snapshot.docs[0].ref;

    const resetWalletData = { walletValue: 10000000 };
    await wallet.update(resetWalletData);

    return res.status(200).json(resetWalletData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const getTotalBuy = async (req, res) => {
  try {
    const snapshot = await db.collection('totalbuyer').get();
    const totalbuyer = snapshot.docs[0].data();
    const totalbuyerValue = totalbuyer.totalbuyerValue;
    return res.status(200).json(totalbuyerValue);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const updateTotal = async (req, res) => {
  try {
    const { totalbuyerValue } = req.body;

    const snapshot = await db.collection('totalbuyer').get();
    const totalbuyer = snapshot.docs[0].ref;
    const updateData = { totalbuyerValue: totalbuyerValue };
    await totalbuyer.update(updateData);

    return res.status(200).json(updateData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export const resetTotalBuy = async (req, res) => {
  try {
    const snapshot = await db.collection('totalbuyer').get();
    const totalbuyer = snapshot.docs[0].ref;
    const resetTotalBuyData = { totalbuyerValue: 0 };
    await totalbuyer.update(resetTotalBuyData);

    return res.status(200).json(resetTotalBuyData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};
