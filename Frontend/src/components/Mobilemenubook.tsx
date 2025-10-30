/* eslint-disable @typescript-eslint/no-explicit-any */
import HTMLFlipBook from 'react-pageflip';
import { useState, useRef, forwardRef, type JSX } from 'react';
import type { Category, MenuItem } from '../types';
import logo from '../assets/cafe-logo.png';
import { MdKeyboardDoubleArrowUp } from 'react-icons/md';
import ImageLoader from './ImageLoader';

interface MobileMenuBookProps {
  categories: Category[];
  items: MenuItem[];
}


const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => {
    return (
      <div className={`page ${className}`} ref={ref}>
        {children}
      </div>
    );
  }
);

Page.displayName = 'Page';

const Mobilemenubook: React.FC<MobileMenuBookProps> = ({ categories, items }) => {
  const bookRef = useRef<any>(null);
  
  // Variety swipe state
  const [currentVarietyIndex, setCurrentVarietyIndex] = useState<{ [key: string]: number }>({});
  const [varietyTouchStart, setVarietyTouchStart] = useState(0);
  const [varietyTouchEnd, setVarietyTouchEnd] = useState(0);
  const [isVarietyDragging, setIsVarietyDragging] = useState(false);
  const [varietyDragOffset, setVarietyDragOffset] = useState(0);
  const [activeVarietyItemId, setActiveVarietyItemId] = useState<string | null>(null);

  const handleVarietySwipe = (itemId: string, totalVarieties: number, direction: 'next' | 'prev') => {
    setCurrentVarietyIndex((prev) => {
      const currentIndex = prev[itemId] || 0;
      let newIndex: number;
      if (direction === 'next') {
        newIndex = currentIndex + 1 >= totalVarieties ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex - 1 < 0 ? totalVarieties - 1 : currentIndex - 1;
      }
      return { ...prev, [itemId]: newIndex };
    });
  };

  // Touch handlers for varieties
  const handleVarietyTouchStart = (e: React.TouchEvent, itemId: string) => {
    e.stopPropagation();
    setVarietyTouchStart(e.touches[0].clientY);
    setIsVarietyDragging(true);
    setActiveVarietyItemId(itemId);
  };

  const handleVarietyTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isVarietyDragging || !activeVarietyItemId) return;
    const currentTouch = e.touches[0].clientY;
    setVarietyDragOffset(currentTouch - varietyTouchStart);
    setVarietyTouchEnd(currentTouch);
  };

  const handleVarietyTouchEnd = (e: React.TouchEvent, itemId: string, totalVarieties: number) => {
    e.stopPropagation();
    setIsVarietyDragging(false);
    const distance = varietyTouchStart - varietyTouchEnd;

    if (Math.abs(distance) > 30) {
      handleVarietySwipe(itemId, totalVarieties, distance > 0 ? 'next' : 'prev');
    }
    setVarietyDragOffset(0);
    setActiveVarietyItemId(null);
  };

  // Mouse handlers for varieties
  const handleVarietyMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setVarietyTouchStart(e.clientY);
    setIsVarietyDragging(true);
    setActiveVarietyItemId(itemId);
  };

  const handleVarietyMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVarietyDragging || !activeVarietyItemId) return;
    setVarietyDragOffset(e.clientY - varietyTouchStart);
    setVarietyTouchEnd(e.clientY);
  };

  const handleVarietyMouseUp = (e: React.MouseEvent, itemId: string, totalVarieties: number) => {
    e.stopPropagation();
    setIsVarietyDragging(false);
    const distance = varietyTouchStart - varietyTouchEnd;

    if (Math.abs(distance) > 30) {
      handleVarietySwipe(itemId, totalVarieties, distance > 0 ? 'next' : 'prev');
    }
    setVarietyDragOffset(0);
    setActiveVarietyItemId(null);
  };

  // Build pages array
  const pages: JSX.Element[] = [];

  // 1. Cover Page
  pages.push(
    <Page key="cover" className="cover-page">
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-[#E2C4A8] to-[#CEC1A8] border-2 border-[#673E20] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <img src={logo} alt="Cafe logo" className="w-32 mb-6 drop-shadow-lg" />
        <h1 className="text-3xl font-bold work-sans text-[#673E20] mb-4">
          Wanna have something delicious?
        </h1>
        <p className="text-lg work-sans text-black mb-2">
          Flip the pages to explore our menu
        </p>
        <div className="mt-6 text-sm text-black work-sans">
          Swipe to turn pages →
        </div>
      </div>
    </Page>
  );

  // 2. Category Index Pages (group categories, 3 per page)
  const categoriesPerPage = 3;
  for (let i = 0; i < categories.length; i += categoriesPerPage) {
    const pageCategories = categories.slice(i, i + categoriesPerPage);
    
    pages.push(
      <Page key={`categories-${i}`} className="category-page">
        <div className="h-full p-6 bg-[#F5EFE7] flex flex-col border-2 border-[#673E20] rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center work-sans text-[#673E20] mb-6 border-b-2 border-[#673E20] pb-2">
            Categories
          </h2>
          <div className="flex-1 flex flex-col gap-4 justify-center">
            {pageCategories.map((cat) => {
              const catItems = items.filter((item) => {
                if (!item.categoryId) return false;
                return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === cat._id;
              });
              return (
                <div
                  key={cat._id}
                  className="flex items-center p-4 rounded-xl shadow-md bg-white border-l-4 border-[#673E20] hover:shadow-lg transition-shadow"
                >
                  <ImageLoader
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-[#673E20]"
                    loaderClassName="w-20 h-20 rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold work-sans text-[#673E20]">{cat.name}</h3>
                    <p className="text-sm text-gray-600 work-sans">
                      {catItems.length} item{catItems.length !== 1 && 's'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Page>
    );
  }

  // 3. Category + Items Pages
  categories.forEach((category) => {
    const categoryItems = items.filter((item) => {
      if (!item.categoryId) return false;
      return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === category._id;
    });

    if (categoryItems.length === 0) return;

    // Category header page
    pages.push(
      <Page key={`cat-header-${category._id}`} className="category-header-page">
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#CEC1A8] to-[#B59E7D] rounded-xl border-2 border-[#673E20] shadow-2xl">
          <ImageLoader
            src={category.imageUrl}
            alt={category.name}
            className="w-48 h-48 object-cover rounded-full border-4 border-[#673E20] shadow-2xl mb-6"
            loaderClassName="w-48 h-48 rounded-full"
          />
          <h2 className="text-4xl font-bold work-sans text-[#673E20] text-center">
            {category.name}
          </h2>
          <div className="mt-4 text-lg text-gray-700 work-sans">
            {categoryItems.length} delicious item{categoryItems.length !== 1 && 's'}
          </div>
        </div>
      </Page>
    );

    // Item pages - one item per page
    categoryItems.forEach((item) => {
      const varietyIdx = currentVarietyIndex[item._id] ?? 0;
      const variety = item.varieties?.[varietyIdx];
      
      // Get category name for badge - handle both string and object categoryId
      const categoryName = typeof item.categoryId === 'string' 
        ? categories.find(c => c._id === item.categoryId)?.name || category.name
        : item.categoryId?.name || category.name;

      pages.push(
        <Page key={`item-${item._id}`} className="item-page">
          <div className="h-full p-4 bg-[#F5EFE7] flex flex-col border-2 border-[#673E20] rounded-xl shadow-lg">
            {/* Item Card */}
            <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#673E20] flex flex-col">
              {/* Image Section */}
              <div className="relative h-64 bg-[#CFC0A9] flex-shrink-0">
                {item.isOutOfStock && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold work-sans z-10 shadow-md">
                    Out of Stock
                  </div>
                )}
                <ImageLoader
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loaderClassName="w-full h-full"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-5 flex flex-col">
                {/* Title and Price */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold work-sans text-[#673E20] flex-1 leading-tight">
                    {item.name}
                  </h3>
                  <div className="ml-3 text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-[#8B5A2B] work-sans">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                {/* Varieties Section */}
                {item.varieties && item.varieties.length > 0 && (
                  <div
                    className="mb-3"
                    onTouchStart={(e) => handleVarietyTouchStart(e, item._id)}
                    onTouchMove={handleVarietyTouchMove}
                    onTouchEnd={(e) => handleVarietyTouchEnd(e, item._id, item.varieties!.length)}
                    onMouseDown={(e) => handleVarietyMouseDown(e, item._id)}
                    onMouseMove={handleVarietyMouseMove}
                    onMouseUp={(e) => handleVarietyMouseUp(e, item._id, item.varieties!.length)}
                    onMouseLeave={(e) => {
                      if (isVarietyDragging && activeVarietyItemId === item._id) {
                        handleVarietyMouseUp(e, item._id, item.varieties!.length);
                      }
                    }}
                  >
                    <div
                      className="bg-gradient-to-r from-[#B59E7D] to-[#9f836a] text-white rounded-lg py-2 px-3 shadow-md transition-all duration-300 ease-out"
                      style={{
                        transform: `translateY(${
                          activeVarietyItemId === item._id ? varietyDragOffset / 3 : 0
                        }px)`,
                        opacity: activeVarietyItemId === item._id && isVarietyDragging ? 0.8 : 1,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-semibold work-sans text-sm">
                            {variety?.name}
                          </span>
                          <span className="ml-2 text-xs">
                            (+₹{variety?.additionalPrice.toFixed(2)})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs work-sans ml-2">
                          <span>Swipe</span>
                          <MdKeyboardDoubleArrowUp className="text-base" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="flex-1 overflow-auto">
                  <p className="text-gray-700 text-base work-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Category Badge */}
                <div className="mt-3 pt-3 border-t border-black">
                  <span className="inline-block bg-[#E2C4A8] text-[#673E20] px-3 py-1 rounded-full text-xs font-semibold work-sans">
                    {categoryName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Page>
      );
    });
  });

  return (
    <div className="mobile-book-wrapper flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5EFE7] to-[#E2C4A8] p-4">
      <HTMLFlipBook
        width={350}
        height={550}
        size="stretch"
        minWidth={315}
        minHeight={400}
        maxWidth={1000}
        maxHeight={1533}
        drawShadow={true}
        flippingTime={800}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={50}
        showPageCorners={true}
        disableFlipByClick={false}
        className="demo-book shadow-2xl "
        style={{}}
        startPage={0}
        maxShadowOpacity={0.5}
        showCover={true}
        ref={bookRef}
      >
        {pages.map((page) => page)}
      </HTMLFlipBook>
    </div>
  );
};

export default Mobilemenubook;