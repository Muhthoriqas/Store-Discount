import React from 'react';

type Voucher = {
  id: string;
  voucherValue: number;
  expiresAt: string;
};

type VoucherTableProps = {
  vouchers: Voucher[];
};

const VoucherTable: React.FC<VoucherTableProps> = ({ vouchers }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-white">
        <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-2 py-3 text-center sm:px-6">
              No
            </th>
            <th scope="col" className="px-2 py-3 text-center sm:px-6">
              Code
            </th>
            <th scope="col" className="px-2 py-3 text-center sm:px-6">
              Value
            </th>
            <th scope="col" className="px-2 py-3 text-center sm:px-6">
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
              <td className="px-2 py-4 text-center sm:px-6">{index + 1}</td>
              <td className="px-2 py-4 text-center sm:px-6">{voucher.id}</td>
              <td className="px-2 py-4 text-center sm:px-6">
                {voucher.voucherValue}
              </td>
              <td className="px-2 py-4 text-center sm:px-6">
                {voucher.expiresAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;
