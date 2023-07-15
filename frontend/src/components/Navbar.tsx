import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between p-5 text-lg text-white bg-gray-800">
      <div className="flex items-center">
        <ul className="flex mx-9 space-x-10">
          <li>
            <a
              href="/"
              className="hover:text-black hover:bg-white p-3 rounded-md"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/voucher"
              className="hover:text-black hover:bg-white p-3 rounded-md"
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
