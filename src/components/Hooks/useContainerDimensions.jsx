import React, { useState, useEffect } from 'react';

export const useContainerDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = (e) => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    console.log(window.innerWidth);
    let width = window.offsetWidth;
    if (window.offsetWidth) console.log('cu');
  };

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      handleResize(e);
    });
    return () => {
      window.removeEventListener('resize', (e) => {
        handleResize(e);
      });
    };
  });

  return dimensions;
};
