import React from 'react';
import { NavLink } from 'react-router-dom';
import './Button.styles.css';

export const Button = (props) => {
  const { type, custom, src, children, onClick, to } = props;

  return (
    <>
      {to && (
        <NavLink
          to={to}
          className={({ isActive }) =>
            `button--${type} ${isActive && 'button--active'} ${
              custom ? custom : ''
            }`
          }
        >
          {src && <div className="button__icon">{src}</div>}
          {children && <span className="button__title">{children}</span>}
        </NavLink>
      )}
      {onClick && (
        <button
          onClick={onClick}
          className={`button--${type} ${custom ? custom : ''}`}
        >
          {src && <div className="button__icon">{src}</div>}
          {children && <span className="button__title">{children}</span>}
        </button>
      )}
    </>
  );
};
