import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between p-4 text-lg text-white bg-gray-800">
      <div className="flex items-center">
        <ul className="flex space-x-10">
          <li>
            <a href="#" className="hover:text-gray-400">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">
              Voucher
            </a>
          </li>
        </ul>
      </div>
      <div>
        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-200 hover:text-black">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
