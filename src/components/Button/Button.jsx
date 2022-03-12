import React from 'react';
import './Button.styles.css';

export const Button = (props) => {
  const { type, custom, src, children, onClick } = props;

  return (
    <>
      {type === 'nav' && (
        <a className={`button--nav ${custom ? custom : ''}`}>
          <div className="button__icon">{src}</div>
          {children && <span className="button__title">{children}</span>}
        </a>
      )}

      {type === 'login' && (
        <a onClick={onClick} className={`button--nav ${custom ? custom : ''}`}>
          <div className="button__icon">{src}</div>
          {children && <span className="button__title">{children}</span>}
        </a>
      )}

      {type === 'icon' && (
        <button
          href="#"
          onClick={onClick}
          className={`button--icon ${custom ? custom : ''}`}
        >
          <div className="button__icon">{src}</div>
        </button>
      )}

      {type === 'player' && (
        <button
          href="#"
          onClick={onClick}
          className={`button--player ${custom ? custom : ''}`}
        >
          <div className="button__icon">{src}</div>
        </button>
      )}
    </>
  );
};
