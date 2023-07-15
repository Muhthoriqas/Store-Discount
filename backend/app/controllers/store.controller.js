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
    const { totalPayment } = req.body;

    const date = new Date();
    const tanggalTransaksi = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const transactionData = {
      totalPayment,
      tanggalTransaksi,
    };

    if (totalPayment >= 2000000) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);

      const formattedExpiresAt = `${expiresAt.getDate()}-${
        expiresAt.getMonth() + 1
      }-${expiresAt.getFullYear()} ${expiresAt.getHours()}:${expiresAt.getMinutes()}:${expiresAt.getSeconds()}`;

      const kelipatan = Math.floor(totalPayment / 2000000);
      const voucherValue = kelipatan * 10000;
      const voucherData = {
        voucherValue,
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

    const voucherSnapshoot = await db
      .collection('vouchers')
      .where('id', '==', voucherId)
      .get();

    if (voucherSnapshoot.empty) {
      return res.status(404).send('Voucher tidak valid.');
    }

    const voucherDoc = voucherSnapshoot.docs[0];
    const vocuherData = voucherDoc.data();
    const expiresAt = vocuherData.expiresAt;

    const currentDate = new Date();
    const isExpired = currentDate > new Date(expiresAt);

    if (isExpired) {
      return res.status(400).send('Voucher telah kadaluarsa.');
    }

    const voucherValue = vocuherData.voucherValue;

    await voucherDoc.ref.delete();

    return res
      .status(200)
      .json({ message: 'Voucher berhasil ditebus.', voucherValue });
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
