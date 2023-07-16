import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import RedeemVoucher from '../components/RedeemVoucher';
import VoucherTable from '../components/VoucherTabel';

import 'tailwindcss/tailwind.css';

type Voucher = {
  id: string;
  voucherValue: number;
  expiresAt: string;
};

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/vouchers');
      setVouchers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <div>
      <Navbar />
      <RedeemVoucher />

      <div className="flex justify-center p-5">
        <div className="w-full sm:w-2/3 lg:w-1/2">
          <h1 className="mt-5 mb-4 text-2xl font-bold text-center">
            Daftar Voucher
          </h1>
          <VoucherTable vouchers={vouchers} />
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;
