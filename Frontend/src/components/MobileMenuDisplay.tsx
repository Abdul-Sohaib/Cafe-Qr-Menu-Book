import { useState } from 'react';
import type { Category, MenuItem } from '../types';

interface MobileMenuDisplayProps {
  categories: Category[];
  items: MenuItem[];
}

const MobileMenuDisplay: React.FC<MobileMenuDisplayProps> = ({ categories, items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories.length > 0 ? categories[0]._id : null
  );
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Category swipe states
  const [categoryTouchStart, setCategoryTouchStart] = useState(0);
  const [categoryTouchEnd, setCategoryTouchEnd] = useState(0);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);
  const [categoryDragOffset, setCategoryDragOffset] = useState(0);

  const handleCategorySwipe = (categoryId: string, index: number) => {
    setSelectedCategory(categoryId);
    setCurrentCategoryIndex(index);
    setCurrentCardIndex(0);
    setDragOffset(0);
  };

  // Category swipe handlers
  const handleCategoryTouchStart = (e: React.TouchEvent) => {
    setCategoryTouchStart(e.touches[0].clientX);
    setIsCategoryDragging(true);
  };

  const handleCategoryTouchMove = (e: React.TouchEvent) => {
    if (!isCategoryDragging) return;
    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - categoryTouchStart;
    setCategoryDragOffset(diff);
    setCategoryTouchEnd(currentTouch);
  };

  const handleCategoryTouchEnd = () => {
    setIsCategoryDragging(false);
    const minSwipeDistance = 50;
    const distance = categoryTouchStart - categoryTouchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && currentCategoryIndex < categories.length - 1) {
        const nextIndex = currentCategoryIndex + 1;
        handleCategorySwipe(categories[nextIndex]._id, nextIndex);
      } else if (distance < 0 && currentCategoryIndex > 0) {
        const prevIndex = currentCategoryIndex - 1;
        handleCategorySwipe(categories[prevIndex]._id, prevIndex);
      } else if (distance > 0 && currentCategoryIndex === categories.length - 1) {
        handleCategorySwipe(categories[0]._id, 0);
      } else if (distance < 0 && currentCategoryIndex === 0) {
        const lastIndex = categories.length - 1;
        handleCategorySwipe(categories[lastIndex]._id, lastIndex);
      }
    }
    setCategoryDragOffset(0);
  };

  const handleCategoryMouseDown = (e: React.MouseEvent) => {
    setCategoryTouchStart(e.clientX);
    setIsCategoryDragging(true);
  };

  const handleCategoryMouseMove = (e: React.MouseEvent) => {
    if (!isCategoryDragging) return;
    const currentPos = e.clientX;
    const diff = currentPos - categoryTouchStart;
    setCategoryDragOffset(diff);
    setCategoryTouchEnd(currentPos);
  };

  const handleCategoryMouseUp = () => {
    setIsCategoryDragging(false);
    const minSwipeDistance = 50;
    const distance = categoryTouchStart - categoryTouchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && currentCategoryIndex < categories.length - 1) {
        const nextIndex = currentCategoryIndex + 1;
        handleCategorySwipe(categories[nextIndex]._id, nextIndex);
      } else if (distance < 0 && currentCategoryIndex > 0) {
        const prevIndex = currentCategoryIndex - 1;
        handleCategorySwipe(categories[prevIndex]._id, prevIndex);
      } else if (distance > 0 && currentCategoryIndex === categories.length - 1) {
        handleCategorySwipe(categories[0]._id, 0);
      } else if (distance < 0 && currentCategoryIndex === 0) {
        const lastIndex = categories.length - 1;
        handleCategorySwipe(categories[lastIndex]._id, lastIndex);
      }
    }
    setCategoryDragOffset(0);
  };

  const filteredItems = items.filter((item) => {
    if (!item.categoryId) return false;
    return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === selectedCategory;
  });

  // Item card swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - touchStart;
    setDragOffset(diff);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && currentCardIndex < filteredItems.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (distance < 0 && currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      } else if (distance > 0 && currentCardIndex === filteredItems.length - 1) {
        setCurrentCardIndex(0);
      } else if (distance < 0 && currentCardIndex === 0) {
        setCurrentCardIndex(filteredItems.length - 1);
      }
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentPos = e.clientX;
    const diff = currentPos - touchStart;
    setDragOffset(diff);
    setTouchEnd(currentPos);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && currentCardIndex < filteredItems.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (distance < 0 && currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      } else if (distance > 0 && currentCardIndex === filteredItems.length - 1) {
        setCurrentCardIndex(0);
      } else if (distance < 0 && currentCardIndex === 0) {
        setCurrentCardIndex(filteredItems.length - 1);
      }
    }
    setDragOffset(0);
  };

  return (
    <div className="min-h-screen p-4 sm:p-2">
      <h1 className=" xs:text-2xl font-bold font-heading mb-6 text-center">Wanna have something delicious?</h1>
      
      {/* Categories Carousel Section */}
      <div className="mb-6">
        <h2 className="text-xl xs:text-xl font-heading2 font-bold mb-4">Categories</h2>
        
        {/* Category indicator dots */}
        <div className="flex justify-center gap-2 mb-4">
          {categories.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentCategoryIndex 
                  ? 'w-8 bg-[#673E20]' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Swipeable category carousel */}
        <div className="overflow-hidden relative h-32 xs:h-24">
          <div
            className="relative w-full h-full"
            onTouchStart={handleCategoryTouchStart}
            onTouchMove={handleCategoryTouchMove}
            onTouchEnd={handleCategoryTouchEnd}
            onMouseDown={handleCategoryMouseDown}
            onMouseMove={handleCategoryMouseMove}
            onMouseUp={handleCategoryMouseUp}
            onMouseLeave={() => {
              if (isCategoryDragging) handleCategoryMouseUp();
            }}
          >
            {categories.map((category, index) => {
              const offset = (index - currentCategoryIndex) * 100;
              const adjustedOffset = offset + (categoryDragOffset / window.innerWidth) * 100;
              const isActive = index === currentCategoryIndex;
              const scale = isActive ? 1 : 0.85;
              const opacity = Math.abs(index - currentCategoryIndex) <= 1 ? 1 : 0;
              const zIndex = isActive ? 10 : Math.max(0, 10 - Math.abs(index - currentCategoryIndex));

              return (
                <div
                  key={category._id}
                  className="absolute top-0 left-0 w-full h-full transition-all duration-300 ease-out px-4 sm:px-2"
                  style={{
                    transform: `translateX(${adjustedOffset}%) scale(${scale})`,
                    opacity,
                    zIndex,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  <div
                    className={`cursor-pointer p-3 sm:p-2 rounded-lg shadow-lg flex items-center gap-4 sm:gap-2 h-full transition-all ${
                      selectedCategory === category._id 
                        ? 'bg-[#B59E7D] border-l-4 border-[#673E20]' 
                        : 'bg-[#CEC1A8]'
                    }`}
                  >
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-20 xs:w-20 h-20 xs:h-20 object-cover rounded-lg border border-[#673E20]"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <h3 className="text-lg xs:text-xl font-light font-body">{category.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipe instruction for categories */}
        <div className="text-center mt-2 text-sm xs:text-md font-body text-gray-900">
          Swipe to browse categories
        </div>
      </div>

      {/* Items Section */}
      {selectedCategory && (
        <div className="mt-20">
          <h2 className="text-2xl xs:text-4xl font-heading font-bold  text-center">
            {categories.find((c) => c._id === selectedCategory)?.name}
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center font-heading text-gray-500 py-8 xs:text-md">No items in this category</div>
          ) : (
            <div className="relative">
             

              {/* Swipeable card container - Stack layout */}
              <div className=" flex justify-center bottom-60 right-[11rem] relative items-center mx-auto" style={{ minHeight: '550px', width: '100%' }}>
                <div
                  className=" w-[343px] xs:w-[70vw] max-w-[343px] mx-auto"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => {
                    if (isDragging) handleMouseUp();
                  }}
                  style={{ perspective: '1000px' }}
                >
                  {filteredItems.map((item, index) => {
                    const position = index - currentCardIndex;
                    const isActive = index === currentCardIndex;
                    
                    // Calculate stacking effect
                    let transform = '';
                    let zIndex = 0;
                    let opacity = 0;
                    
                    if (isDragging && isActive) {
                      // Active card being dragged
                      const dragPercent = dragOffset / window.innerWidth;
                      const rotateY = dragPercent * 15; // Rotation effect
                      transform = `translateX(${dragOffset}px) translateY(0px) scale(1) rotateY(${rotateY}deg)`;
                      zIndex = 50;
                      opacity = 1;
                    } else if (position === 0) {
                      // Current active card (front)
                      transform = 'translateX(0) translateY(0px) scale(1) rotateY(0deg)';
                      zIndex = 40;
                      opacity = 1;
                    } else if (position === 1) {
                      // Next card (slightly behind and to the right)
                      transform = 'translateX(20px) translateY(10px) scale(0.95) rotateY(-5deg)';
                      zIndex = 30;
                      opacity = 0.8;
                    } else if (position === 2) {
                      // Card after next
                      transform = 'translateX(40px) translateY(20px) scale(0.9) rotateY(-8deg)';
                      zIndex = 20;
                      opacity = 0.6;
                    } else if (position === -1) {
                      // Previous card (slightly behind and to the left)
                      transform = 'translateX(-20px) translateY(10px) scale(0.95) rotateY(5deg)';
                      zIndex = 30;
                      opacity = 0.8;
                    } else if (position > 2) {
                      // Cards further ahead
                      transform = 'translateX(60px) translateY(30px) scale(0.85) rotateY(-10deg)';
                      zIndex = 10;
                      opacity = 0;
                    } else {
                      // Cards further behind
                      transform = 'translateX(-40px) translateY(20px) scale(0.9) rotateY(8deg)';
                      zIndex = 10;
                      opacity = 0;
                    }

                    return (
                      <div
                        key={item._id}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[343px] sm:w-[90vw] max-w-[343px] transition-all duration-300 ease-out"
                        style={{
                          transform,
                          zIndex,
                          opacity,
                          pointerEvents: isActive ? 'auto' : 'none',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="bg-[#CEC1A8] rounded-2xl shadow-2xl overflow-hidden border-2 border-[#673E20] p-2">
                          
                          {/* Image Section */}
                          <div className="relative h-80 sm:h-64 bg-[#CEC1A8]">
                            {item.isOutOfStock && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md font-bold text-md font-heading2">
                              Out of Stock
                            </div>
                          )}
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-2xl"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                            {/* Gradient overlay at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="p-6 xs:p-4 bg-[#CEC1A8] hover:bg-[#B59E7D]">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl xs:text-lg font-bold font-heading text-black flex-1">{item.name}</h3>
                              <div className="ml-4 text-right">
                                <p className="text-2xl xs:text-xl font-bold text-[#451C06] font-heading">
                                  ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <p className="text-black text-base xs:text-sm font-body leading-relaxed ">
                              ~ {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

               {/* Card indicator dots */}
              <div className="flex justify-center gap-2 mb-6 -mt-10">
                {filteredItems.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentCardIndex 
                        ? 'w-8 bg-[#673E20]' 
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Swipe instruction */}
              <div className="text-center font-body  text-sm xs:text-md text-gray-900">
                Swipe left or right to browse items
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenuDisplay;