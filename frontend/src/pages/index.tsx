import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Modal from 'react-modal';
import CustomModal from '../components/CustomModal';
import Navbar from '../components/Navbar';
import Wallet from '../components/Wallet';
import ProductCard from '@/components/ProductCard';
import BoughtItems from '../components/BoughtItems';
import 'tailwindcss/tailwind.css';

Modal.setAppElement('#__next');
type Product = {
  id: string;
  imageURL: string;
  name: string;
  price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type HomeProps = {
  products: Product[];
};

const Home: React.FC<HomeProps> = ({ products }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [boughtItems, setBoughtItems] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [voucherValue, setVoucherValue] = useState<number | null>(null);
  const [expireDate, setExpireDate] = useState<string | null>(null);
  const [wallet, setWalletValue] = useState(0);
  const [totalBuy, setTotalBuy] = useState(0);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/wallet'
      );
      setWalletValue(response.data.walletValue);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalBuy = async () => {
    try {
      const response = await axios.get(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/total'
      );
      setTotalBuy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateWallet = async (newWalletValue: number) => {
    try {
      await axios.put(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/update/wallet',
        {
          walletValue: newWalletValue,
        }
      );
      setWalletValue(newWalletValue);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTotalBuy = async (newTotalBuy: number) => {
    try {
      await axios.put(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/update/total',
        {
          totalbuyerValue: newTotalBuy,
        }
      );

      setTotalBuy(newTotalBuy);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchTotalBuy();
  }, []);

  const handleBuy = (product: Product, quantity: number) => {
    const itemIndex = cartItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (itemIndex === -1) {
      const newCartItem = { product, quantity };
      setCartItems([...cartItems, newCartItem]);
    } else {
      const updatedCartItems = [...cartItems];
      updatedCartItems[itemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    }

    const boughtItemIndex = boughtItems.findIndex(
      (item) => item.product.id === product.id
    );
    if (boughtItemIndex === -1) {
      const newBoughtItem = { product, quantity };
      setBoughtItems([...boughtItems, newBoughtItem]);
    } else {
      const updatedBoughtItems = [...boughtItems];
      updatedBoughtItems[boughtItemIndex].quantity += quantity;
      setBoughtItems(updatedBoughtItems);
    }

    recalculateTotalPayment();
  };

  const handleEditQuantity = (itemId: string) => {
    const itemIndex = boughtItems.findIndex(
      (item) => item.product.id === itemId
    );
    if (itemIndex !== -1) {
      const item = boughtItems[itemIndex];
      setEditingItemId(itemId);
      setEditedQuantity(item.quantity);
    }
  };

  const handleChangeEditedQuantity = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuantity = parseInt(e.target.value, 10);
    setEditedQuantity(newQuantity);
  };

  const handleUpdateQuantity = (itemId: string) => {
    const updatedBoughtItems = boughtItems.map((item) => {
      if (item.product.id === itemId) {
        item.quantity = editedQuantity;
      }
      return item;
    });
    setBoughtItems(updatedBoughtItems);
    setEditingItemId(null);
    setEditedQuantity(0);

    recalculateTotalPayment();
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedBoughtItems = boughtItems.filter(
      (item) => item.product.id !== itemId
    );
    setBoughtItems(updatedBoughtItems);

    recalculateTotalPayment();
  };

  const recalculateTotalPayment = () => {
    const newTotalPayment = boughtItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
    setTotalPayment(newTotalPayment);
  };

  const handleCheckout = async (totalPayment: number) => {
    if (totalPayment > wallet) {
      setIsFailureModalOpen(true);
      return;
    }

    try {
      let newTotalBuyValue = totalBuy + totalPayment;

      const response = await axios.post(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/checkout',
        {
          boughtItems,
          totalBuy: newTotalBuyValue,
        }
      );
      newTotalBuyValue = totalBuy + totalPayment;
      const voucherId = response.data.id;
      const voucherValue = response.data.voucherValue;
      const expireDate = response.data.expiresAt;

      setIsSuccessModalOpen(true);

      if (voucherValue !== undefined && voucherValue !== null) {
        setVoucherId(voucherId);
        setVoucherValue(voucherValue);
        setExpireDate(expireDate);
      } else {
        setVoucherValue(null);
      }

      // Update wallet and total buy
      const newWalletValue = wallet - totalPayment;

      updateWallet(newWalletValue);
      updateTotalBuy(newTotalBuyValue);

      setWalletValue(newWalletValue);
      setBoughtItems([]);
      recalculateTotalPayment();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    recalculateTotalPayment();
  }, [boughtItems]);

  const handleResetWallet = async () => {
    try {
      const response = await axios.put(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/reset/wallet'
      );
      const newWalletValue = response.data.walletValue;
      setWalletValue(newWalletValue);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetTotalBuy = async () => {
    try {
      const response = await axios.put(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/reset/total'
      );
      const totalbuyerValue = response.data.totalbuyerValue;
      setTotalBuy(totalbuyerValue);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <Wallet
        wallet={wallet}
        totalBuy={totalBuy}
        onResetWallet={handleResetWallet}
        onResetTotalBuy={handleResetTotalBuy}
      />

      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onBuy={handleBuy} />
        ))}
      </div>
      <div className="flex justify-center mt-5 ">
        <div className="w-full max-w-md p-3 rounded-lg shadow-lg">
          <BoughtItems
            items={boughtItems}
            editingItemId={editingItemId}
            editedQuantity={editedQuantity}
            onEditQuantity={handleEditQuantity}
            onChangeEditedQuantity={handleChangeEditedQuantity}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
          <div className="flex items-center mt-4 justify-evenly">
            <div className="text-lg font-semibold">
              Total Payment: {totalPayment}
            </div>
            <button
              className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600"
              onClick={() => handleCheckout(totalPayment)}
              disabled={boughtItems.length === 0}
            >
              Checkout
            </button>
          </div>

          <CustomModal
            isOpen={isSuccessModalOpen}
            onRequestClose={() => setIsSuccessModalOpen(false)}
            contentLabel="Checkout Success"
          >
            <div className="w-full max-w-md text-white bg-green-600 rounded-lg shadow-lg p-9">
              <h2 className="mb-4 text-2xl font-bold">Pembelian Berhasil!</h2>
              <div className="mb-4">
                {voucherValue !== undefined && voucherValue !== null ? (
                  <>
                    Terima kasih atas pembelian Anda. Karena total pembelian
                    Anda cukup besar, yaitu <strong>{totalBuy}</strong>, Anda
                    berhak mendapatkan voucher senilai{' '}
                    <strong>{voucherValue}</strong>.
                    <br /> <br /> Segera tukarkan voucher tersebut sebelum
                    tanggal <strong>{expireDate}</strong>. Anda dapat
                    menukarkannya di halaman voucher.
                    {voucherId && (
                      <div>
                        <strong className="mb-4 ">
                          Voucher ID: {voucherId}
                        </strong>{' '}
                      </div>
                    )}
                  </>
                ) : (
                  'Terima kasih atas pembelian Anda.'
                )}
              </div>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Tutup
              </button>
            </div>
          </CustomModal>

          <CustomModal
            isOpen={isFailureModalOpen}
            onRequestClose={() => setIsFailureModalOpen(false)}
            contentLabel="Checkout Failure"
          >
            <div className="w-full max-w-md text-white bg-red-600 rounded-lg shadow-lg p-9">
              <h2 className="mb-4 text-2xl font-bold">Pembelian Gagal!</h2>
              <div className="mb-4">
                Total pembayaran melebihi saldo wallet Anda.
              </div>
              <button
                onClick={() => setIsFailureModalOpen(false)}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Tutup
              </button>
            </div>
          </CustomModal>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const [productsResponse, walletResponse, totalBuyResponse] =
      await Promise.all([
        axios.get(
          'https://store-discount-image-lmzymzncdq-et.a.run.app/products'
        ),
        axios.get(
          'https://store-discount-image-lmzymzncdq-et.a.run.app/wallet'
        ),
        axios.get('https://store-discount-image-lmzymzncdq-et.a.run.app/total'),
      ]);

    const products = productsResponse.data;
    const walletValue = walletResponse.data.walletValue;
    const totalBuyValue = totalBuyResponse.data;

    return {
      props: {
        products,
        walletValue,
        totalBuyValue,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        products: [],
        walletValue: 0,
        totalBuyValue: 0,
      },
    };
  }
};

export default Home;
