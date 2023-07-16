import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import RedeemVoucher from '../components/RedeemVoucher';
import 'tailwindcss/tailwind.css';

type Voucher = {
  id: string;
  voucherValue: number;
  expiresAt: string;
};

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/vouchers');
      setVouchers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <RedeemVoucher />

      <div className="flex justify-center p-5">
        <div className="w-full sm:w-2/3 lg:w-1/2">
          <h1 className="mt-5 mb-4 text-2xl font-bold text-center">
            Daftar Voucher
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-white ">
              <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-gray-700 ">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Expired
                  </th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher, index) => (
                  <tr
                    className="text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={voucher.id}
                  >
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-center">{voucher.id}</td>
                    <td className="px-6 py-4 text-center">
                      {voucher.voucherValue}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {voucher.expiresAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await axios.get('http://localhost:8080/vouchers');
    const vouchers: Voucher[] = response.data;
    return { props: { vouchers } };
  } catch (error) {
    console.error(error);
    return { props: { vouchers: [] } };
  }
};

export default VoucherPage;
