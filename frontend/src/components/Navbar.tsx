import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between p-5 text-lg text-white bg-gray-800">
      <div className="flex items-center">
        <ul className="flex mx-auto space-x-10 lg:mx-0">
          <li>
            <a
              href="/"
              className="p-3 rounded-md hover:text-black hover:bg-white"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/voucher"
              className="p-3 rounded-md hover:text-black hover:bg-white"
            >
              Voucher
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
