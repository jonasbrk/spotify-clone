import React from 'react';
import './Button.styles.css';

export const Button = (props) => {
  const { type, custom, src, children } = props;

  return (
    <>
      {type === 'nav' && (
        <a href="#" className={`button--nav ${custom ? custom : ''}`}>
          <div className="button__icon">{src}</div>
          {children && <span className="button__title">{children}</span>}
        </a>
      )}

      {type === 'icon' && (
        <a href="#" className={`button--icon ${custom ? custom : ''}`}>
          <div className="button__icon">{src}</div>
        </a>
      )}
    </>
  );
};
