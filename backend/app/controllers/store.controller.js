import admin from 'firebase-admin';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import db from '../config/firebase.config.js';

const getAllProducts = async (req, res) => {
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

const checkout = async (req, res) => {
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

    // Ambil data terakhir dari database
    const lastTokenSnapshot = await db
      .collection('tokens')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    let lastToken = 0;

    if (!lastTokenSnapshot.empty) {
      lastToken = lastTokenSnapshot.docs[0].data().value;
    }

    // Memeriksa apakah total pembelian pengguna memenuhi syarat untuk mendapatkan token
    if (totalBuy >= lastToken + 2000000) {
      const kelipatan = Math.floor(totalBuy / 2000000);
      const nextToken = kelipatan * 2000000;

      await db
        .collection('tokens')
        .add({ value: nextToken, createdAt: new Date() });

      if (totalBuy >= nextToken) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 2);

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
    }

    // Jika total pembelian pengguna tidak memenuhi syarat untuk mendapatkan voucher, hanya simpan data transaksi
    await db.collection('transactions').add(transactionData);
    return res.status(201).json(transactionData);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi kesalahan server.');
  }
};

const redeemVoucher = async (req, res) => {
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
    const formattedCurrentDate = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    const isExpired = formattedCurrentDate > expiresAt;

    if (isExpired) {
      await Promise.all([
        voucherDoc.ref.delete(),
        walletDoc.update({ walletValue }),
      ]);
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
    return res.status(500).send('Terjadi kesalahan server 1.');
  }
};

const getAllVouchers = async (req, res) => {
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

const getWallet = async (req, res) => {
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

const updateWallet = async (req, res) => {
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

const resetWallet = async (req, res) => {
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

const getTotalBuy = async (req, res) => {
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

const updateTotal = async (req, res) => {
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

const resetTotalBuy = async (req, res) => {
  try {
    const tokensSnapshot = await db.collection('tokens').get();
    const batch = db.batch();

    tokensSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    const totalBuyerSnapshot = await db.collection('totalbuyer').get();
    const totalBuyerRef = totalBuyerSnapshot.docs[0].ref;
    const resetTotalBuyData = { totalbuyerValue: 0 };
    await totalBuyerRef.update(resetTotalBuyData);

    return res.status(200).json(resetTotalBuyData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan server.');
  }
};

export {
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
};
