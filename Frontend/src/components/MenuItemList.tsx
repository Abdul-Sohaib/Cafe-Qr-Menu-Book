/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import type { Category, MenuItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface MenuItemListProps {
  token: string;
  onItemUpdated: () => void;
  onEditItem: (item: MenuItem) => void;
}

const MenuItemList: React.FC<MenuItemListProps> = ({ token, onItemUpdated, onEditItem }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentVarietyIndex, setCurrentVarietyIndex] = useState<{ [key: string]: number }>({});
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
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(`${VITE_BACKEND_URL}/menu/${itemToDelete}`, {
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
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEdit = (item: MenuItem) => {
    onEditItem(item);
  };

  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${VITE_BACKEND_URL}/menu/${id}/toggle-stock`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Item marked as ${currentStatus ? 'in stock' : 'out of stock'}`);
      onItemUpdated();
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please log in again.');
        navigate('/admin');
      } else {
        console.error('Error toggling stock status:', error);
        toast.error('Error updating stock status');
      }
    }
  };

  const nextVariety = (itemId: string, totalVarieties: number) => {
    setCurrentVarietyIndex((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1 >= totalVarieties ? 0 : (prev[itemId] || 0) + 1
    }));
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
                      <div key={item._id} className="bg-white p-4 rounded-lg shadow-lg border-2 border-[#552A0A] h-fit relative">
                        {item.isOutOfStock && (
                          <div className="absolute top-16 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-heading">
                            Out of Stock
                          </div>
                        )}
                        <div className='flex flex-col gap-4'>
                          <div className='flex justify-between items-center'>
                            <h3 className="text-lg font-bold font-heading">{item.name}</h3>
                            <p className="text-gray-600 font-heading font-bold">₹{item.price.toFixed(2)}</p>
                          </div>
                          {item.varieties && item.varieties.length > 0 && (
                            <div className="relative">
                              <div 
                                className="text-sm text-gray-600 font-body cursor-pointer"
                                onClick={() => item.varieties && nextVariety(item._id, item.varieties.length)}
                              >
                                {item.varieties[currentVarietyIndex[item._id] || 0].name} (+₹{item.varieties[currentVarietyIndex[item._id] || 0].additionalPrice.toFixed(2)})
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end mt-4 space-x-2 w-full">
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
                          <button
                            onClick={() => handleToggleStock(item._id, item.isOutOfStock)}
                            className={`text-${item.isOutOfStock ? 'green' : 'yellow'}-500 hover:text-${item.isOutOfStock ? 'green' : 'yellow'}-700`}
                            title={item.isOutOfStock ? 'Mark as In Stock' : 'Mark as Out of Stock'}
                          >
                            <div>
                              {item.isOutOfStock ? 
                                <div className='flex items-center gap-1 border-2 border-red-900 p-1 rounded-lg'>
                                  <span className='text-red-500 font-heading2 font-bold'>Out of Stock</span> 
                                  <FaExclamationCircle className='w-4 text-black'/>
                                </div>
                                :
                                <div className='flex items-center gap-1 border-2 border-green-900 p-1 rounded-lg'> 
                                  <span className='text-green-600 font-heading2 font-bold'>In Stock</span>
                                  <CheckCircle className='w-4 text-black'/>
                                </div>
                              }
                            </div>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#CEC1A8] p-6 rounded-lg shadow-lg border-2 border-[#552A0A] max-w-sm w-full">
                <h3 className="text-2xl font-bold font-heading mb-4 text-center">Confirm Delete</h3>
                <p className="text-black font-heading2 mb-6 text-center">
                  Are you sure you want to delete this menu item?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="flex items-center bg-red-500 border-2 border-red-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 font-heading"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="flex items-center bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 font-heading"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuItemList;