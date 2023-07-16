import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between p-5 text-lg text-white bg-gray-800">
      <div className="flex items-center">
        <ul className="flex mx-auto space-x-10 lg:mx-0">
          <li>
            <Link
              href="/"
              className="p-3 rounded-md hover:text-black hover:bg-white"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/voucher"
              className="p-3 rounded-md hover:text-black hover:bg-white"
            >
              Voucher
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
