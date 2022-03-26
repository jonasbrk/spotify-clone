import React, { useEffect, useState } from 'react';
import './SearchBar.styles.css';
import { CloseImg, SearchImg } from '../../assets/svg';

export const SearchBar = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInput = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    const delay = setTimeout(() => onChange(inputValue), 1000);
    return () => clearTimeout(delay);
  }, [inputValue]);

  return (
    <div className="searchBar">
      <input
        onChange={(e) => {
          handleInput(e.target.value);
        }}
        className="search__input"
        type="text"
        placeholder="Artistas, músicas ou albums"
        value={inputValue}
      />
      <div className="search__icon">
        <SearchImg />
      </div>

      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          className="search__clean__icon"
        >
          <CloseImg />
        </button>
      )}
    </div>
  );
};
