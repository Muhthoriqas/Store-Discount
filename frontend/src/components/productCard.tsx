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
        <div className="w-2/4 h-50">
          <img
            src={product.imageURL}
            alt={product.name}
            style={{ width: '200px', height: '160px' }}
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-orange-500">Price: ${product.price}</p>
        <div className="flex items-center mt-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded"
            onClick={decreaseQuantity}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={isNaN(quantity) ? '' : quantity}
            className="w-16 px-2 py-1 ml-2 border border-gray-300"
            onChange={handleChangeQuantity}
          />
          <button
            className="px-4 py-2 ml-2 text-white bg-blue-500 rounded"
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>
        <button
          className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
          onClick={handleBuy}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
