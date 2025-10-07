/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Category, MenuItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface MenuItemListProps {
  token: string;
  onItemUpdated: () => void;
  onEditItem: (item: MenuItem) => void;
}

const MenuItemList: React.FC<MenuItemListProps> = ({ token, onItemUpdated, onEditItem }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${VITE_BACKEND_URL}/menu`),
          axios.get(`${VITE_BACKEND_URL}/menu/categories`),
        ]);
        setItems(itemsResponse.data);
        setCategories(categoriesResponse.data);
        if (categoriesResponse.data.length > 0) {
          setSelectedCategory(categoriesResponse.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch menu items or categories');
      }
    };
    fetchData();
  }, [VITE_BACKEND_URL, onItemUpdated]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`${VITE_BACKEND_URL}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Menu item deleted successfully');
      onItemUpdated();
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please log in again.');
        navigate('/admin');
      } else {
        console.error('Error deleting item:', error);
        toast.error('Error deleting menu item');
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    onEditItem(item);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 font-heading">Menu Items</h2>
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 font-heading">No categories available</div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-black mb-2 font-heading font-bold" htmlFor="category-select">
              Select Category
            </label>
            <select
              id="category-select"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory && (
            <>
              <h3 className="text-xl font-bold mb-4 font-heading">
                {categories.find((c) => c._id === selectedCategory)?.name}
              </h3>
              {items.filter((item) => {
                if (!item.categoryId) {
                  console.warn(`MenuItem ${item._id} has no categoryId`);
                  return false;
                }
                return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === selectedCategory;
              }).length === 0 ? (
                <div className="text-gray-500">No items in this category</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items
                    .filter((item) => {
                      if (!item.categoryId) {
                        console.warn(`MenuItem ${item._id} has no categoryId`);
                        return false;
                      }
                      return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === selectedCategory;
                    })
                    .map((item) => (
                      <div key={item._id} className="bg-white p-2 rounded-lg shadow-lg border-2 border-[#552A0A] h-fit">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-[20rem] object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className='flex flex-col gap-4'>
                          <div className='flex justify-between items-center'>
                        <h3 className="text-lg font-bold font-heading">{item.name}</h3>
                        <p className="text-gray-600 font-heading font-bold">${item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-gray-500 text-sm font-body">{item.description}</p>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MenuItemList;