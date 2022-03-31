import React, { useEffect, useState, useContext, useRef } from 'react';
import './DisplayFull.styles.css';
import { Card } from '../index';

export const DisplayFull = (props) => {
  const { title, data, type, children } = props;

  return (
    <div className="main__full">
      <div className="main__full--header">
        <h2>{title}</h2>
      </div>
      <div className="main__full--main">
        {children
          ? children
          : data.map((e, index) => <Card itemInfo={e} key={index} />)}
      </div>
    </div>
  );
};
