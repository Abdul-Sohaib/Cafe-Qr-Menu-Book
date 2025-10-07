/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUtensils, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import type { Category } from '../types';

interface CategoryFormProps {
  token: string;
  onCategoryAdded: () => void;
  editingCategory?: Category | null;
  onCancelEdit?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  token,
  onCategoryAdded,
  editingCategory,
  onCancelEdit,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setCurrentImage(editingCategory.imageUrl);
    } else {
      setName('');
      setCurrentImage(null);
      setImage(null);
    }
  }, [editingCategory]);

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
    if (!name) {
      setError('Category name is required');
      toast.error('Category name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    try {
      let response;
      if (editingCategory) {
        response = await axios.put(
          `${VITE_BACKEND_URL}/menu/categories/${editingCategory._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        toast.success('Category updated successfully');
        onCancelEdit?.();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        response = await axios.post(`${VITE_BACKEND_URL}/menu/categories`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Category added successfully');
      }

      onCategoryAdded();
      setError('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error updating category';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  };

  const isEditing = !!editingCategory;

  return (
    <div className="bg-[#CEC1A8] p-6 rounded-lg shadow-lg mb-6 border-2 border-[#552A0A]">
      <h3 className="text-3xl font-bold mb-4 font-heading text-center">
        {isEditing ? 'Edit Category' : 'Add Category'}
      </h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black mb-2  font-heading font-bold" htmlFor="name">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black rounded-lg p-2 text-black bg-transparent font-heading2 placeholder:text-gray-500"
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black mb-2  font-heading font-bold">
            Category Image
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
                className="absolute top-2 right-2 bg-red-500 text-white  rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
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
                  : 'border-gray-300 bg-gray-50 hover:border-[#552A0A] hover:bg-orange-25'
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
            className="flex items-center bg-green-500 border-2 border-green-900 text-white py-2 px-4 rounded-lg font-heading hover:bg-green-600"
          >
            <FaUtensils className="mr-2" />
            {isEditing ? 'Update Category' : 'Add Category'}
          </button>
          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center bg-red-500 text-white py-2 px-4 font-heading rounded-lg hover:bg-red-600"
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

export default CategoryForm;