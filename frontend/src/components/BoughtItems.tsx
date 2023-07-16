import React from 'react';

type Product = {
  id: string;
  imageURL: string;
  name: string;
  price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type BoughtItemsProps = {
  items: CartItem[];
  editingItemId: string | null;
  editedQuantity: number;
  onEditQuantity: (itemId: string) => void;
  onChangeEditedQuantity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
};

const BoughtItems: React.FC<BoughtItemsProps> = ({
  items,
  editingItemId,
  editedQuantity,
  onEditQuantity,
  onChangeEditedQuantity,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div>
      <h2 className="mt-5 mb-4 text-lg font-semibold">Bought Items:</h2>
      <div className="bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 border-b">Product</th>
              <th className="py-2 border-b">Quantity</th>
              <th className="py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.product.id} className="border-b">
                <td className="py-2 text-center">{item.product.name}</td>
                {editingItemId === item.product.id ? (
                  <td className="py-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={isNaN(editedQuantity) ? '' : editedQuantity}
                      onChange={onChangeEditedQuantity}
                      className="w-16 px-2 py-1 border border-gray-300"
                    />
                  </td>
                ) : (
                  <td className="py-2 text-center">{item.quantity}</td>
                )}
                <td className="py-2 text-center">
                  {editingItemId === item.product.id ? (
                    <button
                      className="px-3 py-1 mr-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => onUpdateQuantity(item.product.id)}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 mr-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => onEditQuantity(item.product.id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoughtItems;
