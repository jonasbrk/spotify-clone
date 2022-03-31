import React, { useState } from 'react';
import './Header.styles.css';
import { Button, UserMenu } from '../index';
import { ArrowLeftImg, ArrowRigthImg } from '../../assets/svg/index';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchBar } from '../SearchBar/SearchBar';

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateTo = (index) => {
    if (location.pathname == '/' && index == -1) return;
    navigate(index);
  };
  const handleSearch = (q) => {
    setSearchParams(q && { q });
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
        {location.pathname == '/search' && (
          <SearchBar onChange={handleSearch} />
        )}
      </div>
      <div className="header__wrapper">
        <UserMenu />
      </div>
    </header>
  );
};
