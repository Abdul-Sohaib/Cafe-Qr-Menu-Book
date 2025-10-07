/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Category } from '../types';

interface CategoryListProps {
  token: string;
  onCategoryUpdated: () => void;
  onEditCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ token, onCategoryUpdated, onEditCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
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
  }, [VITE_BACKEND_URL, onCategoryUpdated]); // Refresh when onCategoryUpdated is called

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${VITE_BACKEND_URL}/menu/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Category deleted successfully');
      onCategoryUpdated();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error deleting category';
      toast.error(errorMessage);
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    onEditCategory(category);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 font-heading">Categories</h2>
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 font-heading">No categories available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="bg-white border-2 border-[#552A0A] p-4 rounded-lg shadow-lg h-fit">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-[20rem] object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
              <h3 className="text-lg font-bold font-heading">{category.name}</h3>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
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
    </div>
  );
};

export default CategoryList;