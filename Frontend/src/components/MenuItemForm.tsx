/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUtensils, FaTimes, FaArrowLeft, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import type { Category, MenuItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface MenuItemFormProps {
  token: string;
  onItemAdded: () => void;
  editingItem?: MenuItem | null;
  onCancelEdit?: () => void;
  onBack?: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  token,
  onItemAdded,
  editingItem,
  onCancelEdit,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [varieties, setVarieties] = useState<{ name: string; additionalPrice: string }[]>([]);
  const navigate = useNavigate();
  const isEditing = !!editingItem;

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/menu/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();

    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price.toString());
      setCategoryId(typeof editingItem.categoryId === 'string' ? editingItem.categoryId : editingItem.categoryId._id);
      setVarieties(editingItem.varieties?.map(v => ({ name: v.name, additionalPrice: v.additionalPrice.toString() })) || []);
    } else {
      setName('');
      setPrice('');
      setCategoryId('');
      setVarieties([]);
    }
  }, [VITE_BACKEND_URL, editingItem]);

  const addVariety = () => {
    setVarieties([...varieties, { name: '', additionalPrice: '' }]);
  };

  const removeVariety = (index: number) => {
    setVarieties(varieties.filter((_, i) => i !== index));
  };

  const updateVariety = (index: number, field: 'name' | 'additionalPrice', value: string) => {
    const updatedVarieties = [...varieties];
    updatedVarieties[index][field] = value;
    setVarieties(updatedVarieties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      setError('Name, price, and category are required');
      toast.error('Name, price, and category are required');
      return;
    }
    if (!token) {
      setError('Authentication required. Please log in again.');
      toast.error('Authentication required. Please log in again.');
      navigate('/admin');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('categoryId', categoryId);
    
    if (varieties.length > 0) {
      formData.append('varieties', JSON.stringify(varieties.map(v => ({
        name: v.name,
        additionalPrice: parseFloat(v.additionalPrice) || 0
      }))));
    }

    try {
      if (editingItem) {
        await axios.put(
          `${VITE_BACKEND_URL}/menu/${editingItem._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        toast.success('Menu item updated successfully');
        onCancelEdit?.();
      } else {
        await axios.post(`${VITE_BACKEND_URL}/menu`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Menu item added successfully');
      }
      onItemAdded();
      setError('');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        toast.error('Unauthorized. Please log in again.');
        navigate('/admin');
      } else {
        const errorMessage = error.response?.data?.message || 'Error updating item';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-[#CEC1A8] border-2 border-[#552A0A] rounded-lg shadow-lg">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-black border-2 border-black rounded-md px-2 py-1 font-heading"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      )}
      <h2 className="text-2xl font-bold mb-6 font-heading">
        {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
      </h2>
      {error && <p className="text-red-500 mb-4 font-heading2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black mb-2 font-heading font-bold" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-black"
            placeholder="Enter item name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-black mb-2 font-heading font-bold" htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-black"
            placeholder="Enter price"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-black mb-2 font-heading font-bold" htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-black"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-black mb-2 font-heading font-bold">Varieties</label>
          {varieties.map((variety, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={variety.name}
                onChange={(e) => updateVariety(index, 'name', e.target.value)}
                className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-black"
                placeholder="Variety name"
                required
              />
              <input
                type="number"
                value={variety.additionalPrice}
                onChange={(e) => updateVariety(index, 'additionalPrice', e.target.value)}
                className="w-1/3 border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-black"
                placeholder="Extra price"
                required
              />
              <button
                type="button"
                onClick={() => removeVariety(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariety}
            className="flex items-center text-[#552A0A] hover:text-[#8B6F47] font-heading"
          >
            <FaPlus className="mr-2" />
            Add Variety
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex items-center bg-green-500 border-2 border-green-900 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-heading disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <FaUtensils className="mr-2" />
                {isEditing ? 'Update Item' : 'Add Item'}
              </>
            )}
          </button>
          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 font-heading"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;