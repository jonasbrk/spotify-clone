import React, { useRef, useState } from 'react';
import { CloseImg } from '../../assets/svg';
import { Button } from '../';
import './Modal.styles.css';

export const Modal = ({ children, isOpen, setIsOpen }) => {
  const overlayRef = useRef(null);
  const handleClose = (e) => {
    if (e.className == overlayRef.current.className) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`modal ${isOpen && 'modal--open'}`}
      onClick={(e) => handleClose(e.target)}
    >
      <div className="modal__wrapper">
        <div className="modal__header">
          <h1 className="modal__title">Editar informações</h1>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            type="player"
            src={<CloseImg />}
          />
        </div>
        <div className="modal__main">{children}</div>
      </div>
    </div>
  );
};
