import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { useComponentVisible } from '../../utils';
import './DropdownMenu.styles.css';

export const DropdownMenu = ({ src, children, position }) => {
  const { ref1, ref2, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  return (
    <div ref={ref1} className="dropdownMenu">
      <Button
        type="player"
        src={src}
        onClick={() => {
          setIsComponentVisible(!isComponentVisible);
        }}
      />
      <div
        className={`dropdown__wrapper--${position}  ${
          isComponentVisible && 'dropdown__wrapper--open'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
