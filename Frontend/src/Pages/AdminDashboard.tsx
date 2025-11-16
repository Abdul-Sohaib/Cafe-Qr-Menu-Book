import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import MenuItemForm from '../components/MenuItemForm';
import MenuItemList from '../components/MenuItemList';
import OutOfStockItems from '../components/OutOfStockItems';
import logo from '../assets/Logo.png';
import AnimatedSplashScreen from './AnimatedSplashScreen';
import type { Category, MenuItem } from '../types';

const AdminDashboard: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showItems, setShowItems] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  // Get the frontend URL from environment or use current origin
  const menuUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  // Handle splash screen
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000); // Show splash for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [token]);

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      toast.error('Please log in to access the dashboard');
      navigate('/admin');
    }
  }, [token, navigate]);

  const handleItemAdded = () => {
    setRefresh(!refresh);
    setEditingItem(null);
  };

  const handleCategoryAdded = () => {
    setRefresh(!refresh);
    setEditingCategory(null);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditingCategory(null);
  };

  const handleToggleItems = () => {
    setShowItems(!showItems);
    setShowOutOfStock(false);
    setEditingItem(null);
    setEditingCategory(null);
  };

  const handleToggleOutOfStock = () => {
    setShowOutOfStock(!showOutOfStock);
    setShowItems(false);
    setEditingItem(null);
    setEditingCategory(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const handleDownloadQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 1024, // High resolution for printing
        margin: 2,
        color: {
          dark: '#673E20', // Brown color matching your theme
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H', // High error correction
      });

      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `menu-qr-code-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('QR Code downloaded successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  if (!token) {
    return <div>Loading...</div>;
  }

  if (showSplash) {
    return (
      <AnimatedSplashScreen />
    );
  }

  return (
    <div className="container mx-auto p-4 adminbackground">
      {/* Header with QR Download and Logout */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className='flex flex-col gap-2'>
        <h1 className="text-5xl font-bold text-left flex-1 font-heading">Open House Caffe</h1>
        <h1 className="text-4xl font-bold text-left flex-1 font-heading">Admin Dashboard</h1>
        </div>
        <div>
          <img src={logo} alt="Logo" className='w-28'/>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadQRCode}
            disabled={isGeneratingQR}
            className="flex items-center bg-green-500 border-2 border-green-900 text-white py-2 px-6 rounded-lg hover:bg-green-600 font-heading transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaQrcode className="mr-2 text-xl" />
            {isGeneratingQR ? 'Generating...' : 'Download Menu QR Code'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 font-heading"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Info about QR Code */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <div className="flex items-start">
          <FaQrcode className="text-blue-500 text-2xl mr-3 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 font-heading mb-1">Menu QR Code</h3>
            <p className="text-sm text-blue-800 font-body">
              Click the "Download Menu QR Code" button above to get a high-resolution QR code. 
              Print it and display at your restaurant. Customers can scan it to view your menu. 
              The menu updates automatically when you make changes!
            </p>
            <p className="text-xs text-blue-700 font-body mt-2">
              <strong>Menu URL:</strong> {menuUrl}
            </p>
          </div>
        </div>
      </div>

      {showItems ? (
        <>
          <MenuItemForm
            token={token}
            onItemAdded={handleItemAdded}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
            onBack={handleToggleItems}
          />
          <MenuItemList
            token={token}
            onItemUpdated={handleItemAdded}
            onEditItem={handleEditItem}
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleToggleItems}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 font-heading2"
            >
              Back to Categories
            </button>
            <button
              onClick={handleToggleOutOfStock}
              className="bg-transparent text-black border-2 border-black font-bold py-2 px-4 rounded-lg  font-heading2"
            >
              View Out of Stock Items
            </button>
          </div>
        </>
      ) : showOutOfStock ? (
        <>
          <MenuItemForm
            token={token}
            onItemAdded={handleItemAdded}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
            onBack={handleToggleOutOfStock}
          />
          <OutOfStockItems
            token={token}
            onItemUpdated={handleItemAdded}
            onEditItem={handleEditItem}
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleToggleOutOfStock}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 font-heading2"
            >
              Back to Categories
            </button>
            <button
              onClick={handleToggleItems}
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 font-heading2"
            >
              View All Items
            </button>
          </div>
        </>
      ) : (
        <>
          <CategoryForm
            token={token}
            onCategoryAdded={handleCategoryAdded}
            editingCategory={editingCategory}
            onCancelEdit={handleCancelEdit}
          />
          <CategoryList
            token={token}
            onCategoryUpdated={handleCategoryAdded}
            onEditCategory={handleEditCategory}
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleToggleItems}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-heading"
            >
              Add Items
            </button>
            <button
              onClick={handleToggleOutOfStock}
              className="bg-transparent text-black border-2 border-black py-2 px-4 rounded-lg font-bold  font-heading2"
            >
              View Out of Stock Items
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;