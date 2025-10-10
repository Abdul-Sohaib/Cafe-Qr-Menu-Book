/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUtensils, FaTimes, FaArrowLeft, FaCloudUploadAlt, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
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
      setDescription(editingItem.description);
      setCategoryId(typeof editingItem.categoryId === 'string' ? editingItem.categoryId : editingItem.categoryId._id);
      setCurrentImage(editingItem.imageUrl);
      setVarieties(editingItem.varieties?.map(v => ({ name: v.name, additionalPrice: v.additionalPrice.toString() })) || []);
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setCategoryId('');
      setCurrentImage(null);
      setImage(null);
      setVarieties([]);
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