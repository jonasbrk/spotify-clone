import React, { useEffect, useRef, useState } from 'react';
import './PageBanner.styles.css';
export const PageHeader = ({ bgColor, pageRef }) => {
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
    pageRef.current.parentElement.addEventListener('scroll', () =>
      opacityHandler(),
    );
    return () => {
      pageRef.current.parentElement.removeEventListener('scroll', () =>
        opacityHandler(),
      );
    };
  });
  return (
    <>
      <div className="pageBanner__header">
        <div
          ref={headerGradientRef}
          className="pageBanner__header__gradient"
          style={{ backgroundColor: bgColor }}
        ></div>
      </div>
      <div
        ref={headerBgRef}
        className="pageBanner__header__sticky"
        style={{ backgroundColor: bgColor, opacity: opacity }}
      >
        <div className="pageBanner__header__sticky__gradient"></div>
      </div>
    </>
  );
};
