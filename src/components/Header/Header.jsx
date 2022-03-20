import React, { useState } from 'react';
import './Header.styles.css';
import { Button, UserMenu } from '../index';
import { ArrowLeftImg, ArrowRigthImg } from '../../assets/svg/index';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateTo = (index) => {
    if (location.pathname == '/' && index == -1) return;
    navigate(index);
  };
  return (
    <header>
      <div className="header__wrapper">
        <Button
          type="icon"
          src={<ArrowLeftImg />}
          onClick={() => {
            navigateTo(-1);
          }}
        />
        <Button
          type="icon"
          src={<ArrowRigthImg />}
          onClick={() => {
            navigateTo(+1);
          }}
        />
      </div>
      <div className="header__wrapper">
        <UserMenu />
      </div>
    </header>
  );
};
