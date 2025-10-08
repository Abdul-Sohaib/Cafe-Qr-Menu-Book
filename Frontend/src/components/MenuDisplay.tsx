import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { Category, MenuItem } from '../types';
import AnimatedSplashScreenforcustomer from '../Pages/AnimatedSplashScreenforcustomer';
import MobileMenuDisplay from './MobileMenuDisplay';

const MenuDisplay: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          axios.get(`${VITE_BACKEND_URL}/menu/categories`),
          axios.get(`${VITE_BACKEND_URL}/menu`),
        ]);
        setCategories(categoriesResponse.data);
        setItems(itemsResponse.data);
        if (categoriesResponse.data.length > 0) {
          setSelectedCategory(categoriesResponse.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    fetchData();
  }, [VITE_BACKEND_URL]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return <AnimatedSplashScreenforcustomer />;
  }

  if (isMobile) {
    return <MobileMenuDisplay categories={categories} items={items} />;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const categoryVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        className="text-5xl md:text-4xl font-bold mb-8 text-center"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Wanna have something delicious?
      </motion.h1>
      {categories.length === 0 ? (
        <div className="text-center text-black">No categories available</div>
      ) : (
        <>
          <div className="mb-8">
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories.map((category) => (
                <motion.div
                  key={category._id}
                  variants={categoryVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer p-4 rounded-lg shadow-lg text-center w-40 ${
                    selectedCategory === category._id ? 'bg-[#B59E7D] border-b-4 border-[#673E20]' : 'bg-[#CEC1A8]'
                  }`}
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-24 object-cover rounded-lg mb-2 border border-[#673E20]"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h2 
                  className="text-4xl font-bold mb-4 mt-20 underline text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {categories.find((c) => c._id === selectedCategory)?.name}
                </motion.h2>
                {items.filter((item) => {
                  if (!item.categoryId) {
                    console.warn(`MenuItem ${item._id} has no categoryId`);
                    return false;
                  }
                  return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === selectedCategory;
                }).length === 0 ? (
                  <div className="text-gray-500">No items in this category</div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:px-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {items
                      .filter((item) => {
                        if (!item.categoryId) {
                          console.warn(`MenuItem ${item._id} has no categoryId`);
                          return false;
                        }
                        return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === selectedCategory;
                      })
                      .map((item) => (
                        <motion.div 
                          key={item._id} 
                          className="bg-[#CEC1A8] border-2 border-[#673E20] hover:bg-[#B59E7D] transform ease-in-out h-fit p-4 rounded-lg shadow-lg relative"
                          variants={itemVariants}
                          whileHover={{ 
                            y: -8, 
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            transition: { duration: 0.3 }
                          }}
                        >
                          {item.isOutOfStock && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-heading">
                              Out of Stock
                            </div>
                          )}
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-[20rem] object-cover rounded-xl mb-4"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className='px-1 mb-2'>
                            <div className='flex justify-between items-center'>
                              <h2 className="text-lg font-bold mb-2">{item.name}</h2>
                              <p className="font-bold text-xl text-black mb-2">₹{item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-black text-md">~ {item.description}</p>
                          </div>
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default MenuDisplay;