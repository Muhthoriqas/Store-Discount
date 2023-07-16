import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

type Product = {
  id: string;
  imageURL: string;
  name: string;
  price: number;
};

type ProductCardProps = {
  product: Product;
  onBuy: (product: Product, quantity: number) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleBuy = () => {
    const totalPayment = quantity * product.price;
    onBuy(product, quantity);
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-lg card">
      <div className="flex justify-center">
        <div className="w-2/4 sm:w-1/2 h-50">
          <img
            src={product.imageURL}
            alt={product.name}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-center sm:text-left">{product.name}</h3>
        <p className="text-center text-orange-500 sm:text-left">
          Price: ${product.price}
        </p>
        <div className="flex items-center justify-center mt-4 sm:justify-start">
          <button
            className="px-2 py-1 text-white bg-blue-500 rounded sm:px-4 sm:py-2"
            onClick={decreaseQuantity}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={isNaN(quantity) ? '' : quantity}
            className="w-12 px-2 py-1 ml-2 border border-gray-300 sm:w-16"
            onChange={handleChangeQuantity}
          />
          <button
            className="px-2 py-1 ml-2 text-white bg-blue-500 rounded sm:px-4 sm:py-2"
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>
        <button
          className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded sm:w-auto"
          onClick={handleBuy}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
