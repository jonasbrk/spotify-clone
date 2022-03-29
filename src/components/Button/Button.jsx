import React from 'react';
import { Link } from 'react-router-dom';
import './Button.styles.css';

export const Button = (props) => {
  const { type, custom, src, children, onClick, to } = props;

  return (
    <>
      {type === 'nav' && to && (
        <Link to={to} className={`button--nav ${custom ? custom : ''}`}>
          {src && <div className="button__icon">{src}</div>}
          {children && <span className="button__title">{children}</span>}
        </Link>
      )}
      {type === 'nav' && onClick && (
        <button
          onClick={onClick}
          className={`button--nav ${custom ? custom : ''}`}
        >
          {src && <div className="button__icon">{src}</div>}
          {children && <span className="button__title">{children}</span>}
        </button>
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
