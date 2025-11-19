/* eslint-disable @typescript-eslint/no-explicit-any */
import HTMLFlipBook from 'react-pageflip';
import { useRef, forwardRef, type JSX, useEffect, useState } from 'react';
import type { Category, MenuItem } from '../types';
import logo from '../assets/Logo.png';
import cultureimg from '../assets/Culture_texture.jpg';
import welcomemenimg from '../assets/Men.png';
import leaf from '../assets/leaf.png';
import thankyouimg from '../assets/Thankyou.png';
import sidedoubleline from '../assets/small_line_before_name.svg';
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
  const [itemsPerPage, setItemsPerPage] = useState({ first: 10, subsequent: 17 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 300 && width <= 600) {
        setItemsPerPage({ first: 9, subsequent: 12 });
      } else {
        setItemsPerPage({ first: 10, subsequent: 17 });
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build pages array
  const pages: JSX.Element[] = [];

  // 1. Cover Page
  pages.push(
    <Page key="cover" className="cover-page">
      <div className="flex flex-col items-center justify-center h-full text-center bg-[#DFDAD0] border-[6px] border-[#7B4D29] rounded-md shadow-[10px_14px_25px_rgba(0,0,0,0.25),_2px_3px_8px_rgba(0,0,0,0.15)] overflow-hidden relative cornercut-container">
        <div className="menubackgroundimage "></div>
        <div className='bg-transparent h-full w-[75%] relative right-16 justify-between flex flex-col items-center 
        shadow-[10px_14px_25px_rgba(0,0,0,0.25),_2px_3px_8px_rgba(0,0,0,0.15)] menuwelcomebackgroundimage'>
          <div className="horizintalborder"></div>
          <div className=" flex flex-col items-center justify-center pt-10">
        <img src={logo} alt="Cafe logo" className="w-28 xs:w-24 mb-6 drop-shadow-lg" />
        <h1 className="text-5xl xs:text-4xl p-3 font-regular forum-regular uppercase text-black mb-4">
           Open House caffe
        </h1>
        <div>
          <img src={welcomemenimg} alt="Welcome illustration" className='w-36 xs:w-24  drop-shadow-lg' />
        </div>
        <div className="mt-2 text-2xl xs:text-lg font-regular text-black forum-regular text-center">
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
      <div className='h-full p-2 bodycoverpagebg flex flex-col gap-2  shadow-lg '>
      <div className="h-full p-[2px] bodycoverpagebg flex flex-col gap-2  shadow-lg border-[3px] border-black">
        <div className="flex flex-col h-full border-[3px] border-black p-3">
         <span className="left-border" aria-hidden="true"></span>
  <span className="right-border" aria-hidden="true"></span>
        <h2 className="text-5xl xs:text-3xl font-regular text-center forum-regular text-black pb-1">
          Our Menu
        </h2>
        <div className="flex-1 flex flex-col gap-3 xs:gap-[3px] justify-start pt-3 xs:pt-1">
          {categories.map((cat, index) => (
            <div key={cat._id} className="flex items-baseline">
              <span className="text-xl xs:text-lg font-regular forum-regular text-black">
                {index + 1}. {cat.name}
              </span>
            </div>
          ))}
        </div>
        </div>
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

    // Smart pagination: first page has 10 items (with header), subsequent pages have 17 items
    const FIRST_PAGE_ITEMS = itemsPerPage.first;
    const SUBSEQUENT_PAGE_ITEMS = itemsPerPage.subsequent;
    
    let remainingItems = categoryItems.length;
    let totalPages = 1; // At least one page
    
    if (remainingItems > FIRST_PAGE_ITEMS) {
      remainingItems -= FIRST_PAGE_ITEMS;
      totalPages += Math.ceil(remainingItems / SUBSEQUENT_PAGE_ITEMS);
    }

    let currentItemIndex = 0;

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const itemsForThisPage = pageIndex === 0 ? FIRST_PAGE_ITEMS : SUBSEQUENT_PAGE_ITEMS;
      const startIdx = currentItemIndex;
      const endIdx = Math.min(startIdx + itemsForThisPage, categoryItems.length);
      const pageItems = categoryItems.slice(startIdx, endIdx);
      currentItemIndex = endIdx;

      pages.push(
        <Page key={`cat-items-${category._id}-page-${pageIndex}`} className="category-items-page">
          <div className='h-full p-2 bodycoverpagebg flex flex-col gap-2   shadow-lg overflow-hidden'>
          <div className="h-full p-[2px] flex flex-col gap-2   shadow-lg overflow-hidden border-[3px] border-black">
            <img src={logo} alt="" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-36 w-32 opacity-25 pointer-events-none z-0" />
            <div className="flex flex-col h-full border-[3px] border-black p-3">
             <span className="left-border" aria-hidden="true"></span>
  <span className="right-border" aria-hidden="true"></span>
            {/* Category Header with Image - only on first page */}
            {pageIndex === 0 && (
              <div className="pb-7 xs:pb-3  flex flex-col items-center  justify-between w-full gap-5">
                <div className='flex flex-row justify-start items-center w-full gap-2'>
                  <img src={sidedoubleline} alt="" className=" h-full  justify-center items-center" />
                <h2 className="text-3xl font-regular forum-regular text-black justify-center text-start w-full">
                  {category.name}
                </h2>
                </div>
                <div className='imagebasegradient flex p-3 xs:p-2 gap-1 w-60 xs:w-56 quotebg rounded-s-full relative left-[20vw] xs:left-[13vw]'>
                  
                {category.quote && (
                  <div className="category-quote forum-regular mt-2 pl-16">
                    {category.quote}
                  </div>
                )}
                </div>
                <div className='absolute left-[33vw] top-[5.5vh] xs:left-[23vw] xs:top-[8.5vh]'>
                 <ImageLoader
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-28 h-28 xs:w-24 xs:h-24 object-cover rounded-full relative  border-2 border-black shadow-md flex-shrink-0 "
                  loaderClassName="w-fit  rounded-full"
                />
                </div>
                
                
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-hidden pt-6 xs:pt-0">
              <div className="space-y-2">
                {pageItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl xs:text-lg font-regular forum-regular text-black">
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
              <div className="mt-3 pt-2 border-t border-[#B59E7D] text-center text-sm text-gray-600 forhum-regular">
                Page {pageIndex + 1} of {totalPages}
              </div>
            )}
            </div>
          </div>
          </div>
        </Page>
      );
    }
  });

     pages.push(
    <Page key="thank-you" className="thank-you-page">
      <div className='h-full p-2 bodycoverpagebg flex flex-col gap-2 shadow-lg'>
    <div className="h-full p-[2px] bodycoverpagebg flex flex-col gap-2   shadow-lg border-[3px] border-black">
      <div className="flex flex-col h-full border-[3px] border-black p-3 gap-4">

  <div className='flex w-full justify-center items-center flex-1'>
       <img src={leaf} alt="leaf" className="w-32 xs:w-24  drop-shadow-lg -rotate-[20deg]" />
       <img src={logo} alt="Cafe logo" className="w-40 xs:w-36  drop-shadow-lg" />
       <img src={leaf} alt="leaf" className="w-32 xs:w-24  drop-shadow-lg scale-x-[-1] rotate-[20deg]" />
       </div>
       <h2 className='text-[28px] xs:text-[22px] font-regular text-center forum-regular text-black uppercase'>Thank you for choosing Open House CaffE</h2>
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