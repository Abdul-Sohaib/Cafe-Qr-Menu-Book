import React, { useState, useRef, useEffect } from 'react';
import { Coffee } from 'lucide-react';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  loaderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loaderClassName = '',
  onLoad,
  onError,
  fallbackSrc = '/placeholder-image.jpg',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);

    // Preload image to track real load time
    if (src) {
      const img = new Image();
      
      img.onload = () => {
        setIsLoading(false);
        onLoad?.();
      };

      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
      };

      // Start loading - this will take real time based on network
      img.src = src;
    }
  }, [src, onLoad, onError]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${loaderClassName}`}>
      {/* Loader skeleton with coffee cup animation */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer z-20 flex items-center justify-center">
          {/* Coffee cup loader container */}
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Animated coffee cup */}
            <div className="relative">
              <Coffee 
                className="w-12 h-12 text-[#673E20] animate-bounce"
                strokeWidth={1.5}
              />
              {/* Steam animation */}
              <div className="absolute top-0 left-2 w-1 h-3 bg-gray-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-0 left-5 w-1 h-4 bg-gray-400 rounded-full animate-pulse opacity-40" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute top-1 left-8 w-1 h-3 bg-gray-400 rounded-full animate-pulse opacity-50" style={{animationDelay: '0.6s'}}></div>
            </div>
            
            {/* Loading text */}
            <span className="text-xs xs:text-sm font-medium text-[#673E20] tracking-widest">
              BREWING<span className="inline-block animate-pulse">...</span>
            </span>
          </div>
        </div>
      )}

      {/* Image - waits for real load completion */}
      <img
        ref={imgRef}
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default ImageLoader;