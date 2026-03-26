import React, { useState } from 'react';

const SafeImage = ({ src, alt, className, fallback = null }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.error(`Failed to load image: ${imgSrc}`);
      setHasError(true);
      
      // Try fallback strategies
      if (fallback) {
        setImgSrc(fallback);
      } else {
        // Try to construct a public URL if the imported one fails
        if (typeof src === 'string' && !src.startsWith('/assets/')) {
          // If it's an imported image that failed, try the public path
          const fileName = src.split('/').pop();
          setImgSrc(`/assets/${fileName}`);
        }
      }
    }
  };

  if (hasError && !fallback) {
    // Return a placeholder div if no fallback and image failed
    return (
      <div 
        className={`${className} bg-gray-800 flex items-center justify-center`}
        style={{ minHeight: '200px' }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default SafeImage;
