import React, { useEffect, useRef, useState } from 'react';
import './PageBanner.styles.css';
export const PageHeader = ({ bgColor }) => {
  const headerBgRef = useRef(null);
  const headerGradientRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  const opacityHandler = () => {
    const grandienInfo = headerGradientRef.current.getBoundingClientRect();
    const opacitiyPercent = (
      1 -
      ((grandienInfo.bottom - 64) * 100) / ((grandienInfo.height - 64) * 100)
    ).toFixed(2);
    console.log(opacitiyPercent);

    if (opacitiyPercent >= 1) {
      setOpacity(1);
    } else setOpacity(opacitiyPercent);
  };

  useEffect(() => {
    console.log(headerBgRef);
    headerBgRef.current.parentNode.addEventListener('scroll', () =>
      opacityHandler(),
    );
    return () => {
      headerBgRef.current.parentNode.removeEventListener('scroll', () =>
        opacityHandler(),
      );
    };
  }, [headerBgRef]);
  return (
    <>
      <div className="page__header" ref={headerBgRef}>
        <div
          ref={headerGradientRef}
          className="pageBanner__header__gradient"
          style={{ backgroundColor: bgColor }}
        ></div>
      </div>
      <div
        className="page__header__sticky"
        style={{ backgroundColor: bgColor, opacity: opacity }}
      >
        <div className="pageBanner__header__sticky__gradient"></div>
      </div>
    </>
  );
};
