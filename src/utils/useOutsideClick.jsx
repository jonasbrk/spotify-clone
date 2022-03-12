import { useState, useEffect, useRef } from 'react';

export function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const handleClickOutside = (event) => {
    if (
      ref1.current &&
      ref2.current &&
      !ref1.current.contains(event.target) &&
      !ref2.current.contains(event.target)
    ) {
      setIsComponentVisible(false);
    }

    if (ref1.current && !ref2.current && !ref1.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  });

  return { ref1, ref2, isComponentVisible, setIsComponentVisible };
}
