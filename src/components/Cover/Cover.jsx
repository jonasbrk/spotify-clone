import React, { useState } from 'react';
import { Modal } from '../';
import { EditImg, SongImg } from '../../assets/svg';
import './Cover.styles.css';

export const Cover = ({ src, onClick, editable, children }) => {
  const handleOpen = () => {};

  return (
    <>
      <div className="cover">
        {src == undefined ? (
          <div className="undefined__cover">
            <div className="undefined__icon">
              <SongImg />
            </div>
          </div>
        ) : (
          <img src={src} alt="" />
        )}
        {editable && (
          <div className="cover__overlay" onClick={() => onClick()}>
            <EditImg />
            <span>Escolher foto</span>
          </div>
        )}
        {children}
      </div>
    </>
  );
};
