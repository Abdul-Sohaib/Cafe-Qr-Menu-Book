/* eslint-disable @typescript-eslint/no-explicit-any */
import HTMLFlipBook from 'react-pageflip';
import { useRef, forwardRef, type JSX } from 'react';
import type { Category, MenuItem } from '../types';
import logo from '../assets/Logo.png';
import cultureimg from '../assets/Culture_texture.jpg';
import welcomemenimg from '../assets/Men.png';
import leaf from '../assets/leaf.png';
import thankyouimg from '../assets/Thankyou.png';
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

  // Build pages array
  const pages: JSX.Element[] = [];

  // 1. Cover Page
  pages.push(
    <Page key="cover" className="cover-page">
      <div className="flex flex-col items-center justify-center h-full text-center bg-[#DFDAD0] border-[6px] border-[#7B4D29] rounded-md shadow-[10px_14px_25px_rgba(0,0,0,0.25),_2px_3px_8px_rgba(0,0,0,0.15)] overflow-hidden relative cornercut-container">
        <div className="menubackgroundimage "></div>
        <div className='bg-purple-200 h-full w-[75%] relative right-16 justify-between flex flex-col items-center 
        shadow-[10px_14px_25px_rgba(0,0,0,0.25),_2px_3px_8px_rgba(0,0,0,0.15)] menuwelcomebackgroundimage'>
          <div className="horizintalborder"></div>
          <div className=" flex flex-col items-center justify-center pt-10">
        <img src={logo} alt="Cafe logo" className="w-28 mb-6 drop-shadow-lg" />
        <h1 className="text-4xl p-3 font-regular forum-regular uppercase text-black mb-4">
           Open House caffe
        </h1>
        <div>
          <img src={welcomemenimg} alt="Welcome illustration" className='w-32  drop-shadow-lg' />
        </div>
        <div className="mt-2 text-xl font-regular text-black forum-regular text-center">
          Swipe to turn pages →
        </div>
        </div>
         <div className="verticalborder"></div>
        <div className='w-[100%]  relative bottom-0 flex justify-center items-end z-30'>
          <img src={cultureimg} alt="Culture illustration" className='h-fit' />
        </div>
        </div>
      </div>
    </Page>
  );

  // 2. Categories Index Page (all categories as text list)
  pages.push(
    <Page key="categories-index" className="category-index-page">
      <div className="h-full p-2 bodycoverpagebg flex flex-col gap-2  rounded-md shadow-lg">
         <span className="left-border" aria-hidden="true"></span>
  <span className="right-border" aria-hidden="true"></span>
        <h2 className="text-5xl font-regular text-center forum-regular text-black  border-b-2 border-[#673E20] pb-1">
          Our Menu
        </h2>
        <div className="flex-1 flex flex-col gap-3 justify-start">
          {categories.map((cat, index) => (
            <div key={cat._id} className="flex items-baseline">
              <span className="text-xl font-regular forum-regular text-black">
                {index + 1}. {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );



  // 3. Category Items Pages (traditional menu list style)
  categories.forEach((category) => {
    const categoryItems = items.filter((item) => {
      if (!item.categoryId) return false;
      return (typeof item.categoryId === 'string' ? item.categoryId : item.categoryId._id) === category._id;
    });

    if (categoryItems.length === 0) return;

    const ITEMS_PER_PAGE = 17;
    const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const startIdx = pageIndex * ITEMS_PER_PAGE;
      const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, categoryItems.length);
      const pageItems = categoryItems.slice(startIdx, endIdx);

      pages.push(
        <Page key={`cat-items-${category._id}-page-${pageIndex}`} className="category-items-page">
          <div className="h-full p-1 bodycoverpagebg flex flex-col gap-2  rounded-xl shadow-lg overflow-hidden">
             <span className="left-border" aria-hidden="true"></span>
  <span className="right-border" aria-hidden="true"></span>
            {/* Category Header with Image - only on first page */}
            {pageIndex === 0 && (
              <div className="pb-1 border-b-2 border-black flex items-center  justify-between">
                <div className='imagebasegradient flex p-1 gap-1 w-52   bg-gradient-to-r from-orange-400 to-orange-300 rounded-e-full relative -left-7'>
                {category.quote && (
                  <div className="category-quote forum-regular mt-2 pr-16">
                    {category.quote}
                  </div>
                )}
                </div>
                <div className='absolute left-40'>
                 <ImageLoader
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-full relative  border-2 border-black shadow-md flex-shrink-0 "
                  loaderClassName="w-fit  rounded-full"
                />
                </div>
                
                <h2 className="text-4xl font-regular forum-regular text-black">
                  {category.name}
                </h2>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-hidden">
              <div className="space-y-2">
                {pageItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-regular forum-regular text-black">
                          {item.name}
                        </span>
                        {item.isOutOfStock && (
                          <span className="text-md text-red-600 font-regular forum-regular">
                            (Out of Stock)
                          </span>
                        )}
                      </div>
                      {item.varieties && item.varieties.length > 0 && (
                        <div className="mt-1 text-md text-black forum-regular">
                          {item.varieties.map((variety, vIdx) => (
                            <div key={vIdx}>
                              ~ {variety.name} (+₹{variety.additionalPrice})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span className="text-xl font-regular forum-regular text-black whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>

            {/* Page number if multiple pages */}
            {totalPages > 1 && (
              <div className="mt-3 pt-2 border-t border-[#B59E7D] text-center text-sm text-gray-600 work-sans">
                Page {pageIndex + 1} of {totalPages}
              </div>
            )}
          </div>
        </Page>
      );
    }
  });

     pages.push(
    <Page key="thank-you" className="thank-you-page">
    <div className="h-full p-2 bodycoverpagebg flex flex-col gap-2  rounded-md shadow-lg">
         <span className="left-border" aria-hidden="true"></span>
  <span className="right-border" aria-hidden="true"></span>
  <div className='flex w-full justify-center items-center flex-1'>
       <img src={leaf} alt="leaf" className="w-24  drop-shadow-lg -rotate-[20deg]" />
       <img src={logo} alt="Cafe logo" className="w-40  drop-shadow-lg" />
       <img src={leaf} alt="leaf" className="w-24  drop-shadow-lg scale-x-[-1] rotate-[20deg]" />
       </div>
       <h2 className='text-[28px] font-regular text-center forum-regular text-black uppercase'>Thank you for choosing Open House CaffE</h2>
       <div className='flex justify-center w-full items-center'>
        <img src={thankyouimg} alt="thank you" className="w-24  drop-shadow-lg" />
       </div>
       <div className='flex flex-col justify-center items-center text-center gap-1 text-black forum-regular'>
        <span> 2nd Floor, Royal Arcade</span>
        <span>Gar Ali, Jorhat-785001(Assam)</span>
        <span>+91 8486196543</span>
        <span> +91 7002555952</span>
       </div>
      </div>
    </Page>
  );
  return (
    <div className="mobile-book-wrapper flex items-center justify-center min-h-screen p-4">
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