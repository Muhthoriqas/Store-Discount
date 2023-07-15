import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Modal from 'react-modal';
import ProductCard from '../components/productCard';
import Navbar from '../components/Navbar';
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
      const response = await axios.get('http://localhost:8080/wallet');
      setWalletValue(response.data.walletValue);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalBuy = async () => {
    try {
      const response = await axios.get('http://localhost:8080/total');
      setTotalBuy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateWallet = async (newWalletValue: number) => {
    try {
      await axios.put('http://localhost:8080/update/wallet', {
        walletValue: newWalletValue,
      });
      setWalletValue(newWalletValue);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTotalBuy = async (newTotalBuy: number) => {
    try {
      await axios.put('http://localhost:8080/update/total', {
        totalbuyerValue: newTotalBuy,
      });
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
      // Memperbarui totalBuy dengan permintaan ke server

      const newTotalBuyValue = totalBuy + totalPayment;

      const response = await axios.post('http://localhost:8080/checkout', {
        boughtItems,
        totalBuy: newTotalBuyValue,
      });

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

  const resetWalletValue = async () => {
    try {
      const response = await axios.put('http://localhost:8080/reset/wallet');
      const newWalletValue = response.data.walletValue;
      setWalletValue(newWalletValue);
    } catch (error) {
      console.error(error);
    }
  };

  const resetTotalBuyValue = async () => {
    try {
      const response = await axios.put('http://localhost:8080/reset/total');
      const totalbuyerValue = response.data.totalbuyerValue;
      setTotalBuy(totalbuyerValue);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex flex-row items-center justify-between m-4 shadow-lg p-4">
        <div>
          <h1 className="font-semibold m-0 text-2xl">Wallet: {wallet}</h1>
          <h1 className="font-semibold m-0 text-2xl">Total Buy: {totalBuy}</h1>
        </div>

        <div>
          <button
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-200 hover:text-black"
            onClick={resetWalletValue}
          >
            Reset Wallet
          </button>
          <button
            className="px-4 py-2 ml-3 text-white bg-blue-500 rounded hover:bg-blue-200 hover:text-black"
            onClick={resetTotalBuyValue}
          >
            Reset Total Belanja
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onBuy={handleBuy} />
        ))}
      </div>
      <div className="flex justify-center mt-5 ">
        <div className="w-full max-w-md p-3 rounded-lg shadow-lg">
          <h2 className="mt-5 mb-4 text-lg font-semibold">Bought Items:</h2>
          <div className="bg-white ">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-2 border-b">Product</th>
                  <th className="py-2 border-b">Quantity</th>
                  <th className="py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {boughtItems.map((item) => (
                  <tr key={item.product.id} className="border-b">
                    <td className="py-2 text-center">{item.product.name}</td>
                    {editingItemId === item.product.id ? (
                      <td className="py-2 text-center">
                        <input
                          type="number"
                          min="1"
                          value={editedQuantity}
                          onChange={handleChangeEditedQuantity}
                          className="w-16 px-2 py-1 border border-gray-300"
                        />
                      </td>
                    ) : (
                      <td className="py-2 text-center">{item.quantity}</td>
                    )}
                    <td className="py-2 text-center">
                      {editingItemId === item.product.id ? (
                        <button
                          className="px-3 py-1 mr-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                          onClick={() => handleUpdateQuantity(item.product.id)}
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 mr-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                          onClick={() => handleEditQuantity(item.product.id)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center mt-4 justify-evenly">
            <p className="text-lg font-semibold">
              Total Payment: {totalPayment}
            </p>
            <button
              className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600"
              onClick={() => handleCheckout(totalPayment)}
              disabled={boughtItems.length === 0}
            >
              Checkout
            </button>
          </div>

          <Modal
            isOpen={isSuccessModalOpen}
            onRequestClose={() => setIsSuccessModalOpen(false)}
            contentLabel="Checkout Success"
            className="fixed inset-0 z-50 flex items-center justify-center shadow-lg"
            overlayClassName="fixed inset-0 bg-transparent opacity-100 flex items-center justify-center"
          >
            <div className="w-full max-w-md text-white bg-green-600 rounded-lg shadow-lg p-9">
              <h2 className="mb-4 text-2xl font-bold">Pembelian Berhasil!</h2>

              <p className="mb-4">
                {voucherValue !== undefined && voucherValue !== null ? (
                  <>
                    Terima kasih atas pembelian Anda. Karena pembelian Anda
                    cukup besar, Anda berhak mendapatkan voucher senilai{' '}
                    <strong>{voucherValue}</strong>. <br /> <br /> Segera
                    tukarkan voucher tersebut sebelum tanggal{' '}
                    <strong>{expireDate}</strong>. Anda dapat menukarkannya di
                    halaman voucher.
                    {voucherId && (
                      <p>
                        <strong className="mb-4 ">
                          Voucher ID: {voucherId}
                        </strong>{' '}
                      </p>
                    )}
                  </>
                ) : (
                  'Terima kasih atas pembelian Anda.'
                )}
              </p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Tutup
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={isFailureModalOpen}
            onRequestClose={() => setIsFailureModalOpen(false)}
            contentLabel="Checkout Failure"
            className="fixed inset-0 z-50 flex items-center justify-center shadow-lg"
            overlayClassName="fixed inset-0 bg-transparent opacity-100 flex items-center justify-center"
          >
            <div className="w-full max-w-md text-white bg-red-600 rounded-lg shadow-lg p-9">
              <h2 className="mb-4 text-2xl font-bold">Pembelian Gagal!</h2>
              <p className="mb-4">
                Total pembayaran melebihi saldo wallet Anda.
              </p>
              <button
                onClick={() => setIsFailureModalOpen(false)}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Tutup
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const [productsResponse, walletResponse, totalBuyResponse] =
      await Promise.all([
        axios.get('http://localhost:8080/products'),
        axios.get('http://localhost:8080/wallet'),
        axios.get('http://localhost:8080/total'),
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
