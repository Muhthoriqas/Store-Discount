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
      const response = await axios.post(
        'https://store-discount-image-lmzymzncdq-et.a.run.app/redeem',
        {
          voucherId,
        }
      );

      const { message, voucherValue } = response.data;
      setMessage(message);
      setVoucherValue(voucherValue);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        setMessage('Voucher tidak valid.');
      } else if (error.response && error.response.status === 400) {
        setMessage('Voucher telah kadaluarsa.');
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
        <h2 className="mt-5 mb-4 text-lg font-semibold text-center">
          Redeem Voucher
        </h2>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={voucherId}
            onChange={(e) => setVoucherId(e.target.value)}
            placeholder="Masukkan kode voucher"
            className="px-4 py-2 mr-2 border border-gray-300"
          />
          <button
            onClick={handleRedeem}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Redeem
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Redeem Voucher Modal"
          className="fixed inset-0 flex items-center justify-center modal "
          overlayClassName="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-75"
        >
          <div className="p-4 bg-white rounded-md modal-content">
            <h2 className="mb-4 text-lg font-semibold">
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
              className="px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded modal-close hover:bg-blue-600"
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
