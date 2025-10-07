/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUtensils, FaTimes, FaArrowLeft, FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
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
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      setDescription(editingItem.description);
      setCategoryId(typeof editingItem.categoryId === 'string' ? editingItem.categoryId : editingItem.categoryId._id);
      setCurrentImage(editingItem.imageUrl);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setCategoryId('');
      setCurrentImage(null);
      setImage(null);
    }
  }, [VITE_BACKEND_URL, editingItem]);

  const handleImageChange = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (file && validTypes.includes(file.type)) {
      setImage(file);
      setCurrentImage(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please upload only SVG, PNG, JPG or GIF files');
      toast.error('Please upload only SVG, PNG, JPG or GIF files');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setCurrentImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !categoryId) {
      setError('All fields are required');
      toast.error('All fields are required');
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
    formData.append('description', description);
    formData.append('categoryId', categoryId);
    if (image) {
      formData.append('image', image);
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
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!editingItem;

  return (
    <div className="bg-[#CEC1A8] border-2 border-[#552A0A] p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-3xl font-bold font-heading text-center w-full">
          {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
        </h3>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-heading2"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        )}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
          <label className="block text-black mb-2 font-heading font-bold" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-black"
            placeholder="Enter description"
            rows={3}
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
          <label className="block text-black mb-2 font-heading font-bold">
            Menu Item Image
          </label>
          
          {currentImage ? (
            <div className="relative inline-block">
              <img 
                src={currentImage} 
                alt="Preview" 
                className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300" 
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
              >
                <FaTimes className="w-2 h-2" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#552A0A] bg-orange-50'
                  : 'border-gray-300 bg-gray-50 hover:border-[#552A0A] hover:bg-blue-25'
              }`}
            >
              <input
                type="file"
                id="image"
                accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
                onChange={handleFileInput}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <FaCloudUploadAlt className="w-16 h-16 text-[#8B6F47] mx-auto" />
                  </div>
                  <p className="text-base mb-2">
                    <span className="text-orange-600 font-semibold hover:underline font-heading">
                      Click to upload
                    </span>
                    <span className="text-gray-600 font-body"> or drag and drop</span>
                  </p>
                  <p className="text-sm text-gray-500 font-body">
                    SVG, PNG, JPG or GIF (MAX. 800×400px)
                  </p>
                </div>
              </label>
            </div>
          )}
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