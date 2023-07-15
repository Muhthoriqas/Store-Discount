import { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const RedeemVoucher = () => {
  const [voucherId, setVoucherId] = useState('');
  const [message, setMessage] = useState('');
  const [voucherValue, setVoucherValue] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRedeem = async () => {
    try {
      const response = await axios.post('http://localhost:8080/redeem', {
        voucherId,
      });

      const { message, voucherValue } = response.data;
      setMessage(message);
      setVoucherValue(voucherValue);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        setMessage('Voucher tidak valid.');
      } else {
        setMessage('Terjadi kesalahan server.');
      }
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-2/3 lg:w-1/2">
        <h2 className="text-lg font-semibold mb-4 mt-5 text-center">
          Redeem Voucher
        </h2>
        <div className="flex  justify-center mb-4">
          <input
            type="text"
            value={voucherId}
            onChange={(e) => setVoucherId(e.target.value)}
            placeholder="Masukkan kode voucher"
            className="mr-2 px-4 py-2 border border-gray-300"
          />
          <button
            onClick={handleRedeem}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Redeem
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Redeem Voucher Modal"
          className="modal fixed inset-0 flex items-center justify-center "
          overlayClassName="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-75"
        >
          <div className="modal-content bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4">
              {voucherValue ? 'Berhasil Digunakan!' : 'Gagal Redeem Voucher'}
            </h2>
            <p>{message}</p>
            {voucherValue && (
              <p className="mt-3 mb-3">
                {' '}
                <strong>Nilai voucher: {voucherValue}</strong>
              </p>
            )}
            <button
              onClick={closeModal}
              className="modal-close mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              Tutup
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RedeemVoucher;
