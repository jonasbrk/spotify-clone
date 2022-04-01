import React, { useState, useEffect, useRef } from 'react';

export function useContainerDimensions() {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (ref.current != null) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, []);

  const handleResize = () => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  };

  useEffect(() => {
    if (ref.current) {
      window.addEventListener('resize', () => {
        handleResize();
      });
      return () => {
        window.removeEventListener('resize', () => {
          handleResize();
        });
      };
    }
  }, [ref]);

  return { dimensions, ref };
}
