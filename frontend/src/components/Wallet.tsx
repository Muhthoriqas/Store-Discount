import React from 'react';

type WalletProps = {
  wallet: number;
  totalBuy: number;
  onResetWallet: () => void;
  onResetTotalBuy: () => void;
};

const Wallet: React.FC<WalletProps> = ({
  wallet,
  totalBuy,
  onResetWallet,
  onResetTotalBuy,
}) => {
  return (
    <div className="flex flex-col items-center justify-between p-4 m-4 shadow-lg sm:flex-row">
      <div className="mb-4 sm:mb-0 sm:mr-4">
        <h1 className="m-0 text-2xl font-semibold">Wallet: {wallet}</h1>
        <h1 className="m-0 text-2xl font-semibold">Total Buy: {totalBuy}</h1>
      </div>

      <div>
        <button
          className="px-4 py-2 mb-2 text-white bg-green-500 rounded sm:mb-0 hover:bg-green-200 hover:text-black sm:m-3"
          onClick={onResetWallet}
        >
          Reset Wallet
        </button>
        <button
          className="px-4 py-2 ml-0 text-white bg-blue-500 rounded sm:ml-3 hover:bg-blue-200 hover:text-black sm:m-3"
          onClick={onResetTotalBuy}
        >
          Reset Total Belanja
        </button>
      </div>
    </div>
  );
};

export default Wallet;
