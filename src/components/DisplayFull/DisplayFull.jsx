import React, { useEffect, useState, useContext, useRef } from 'react';
import './DisplayFull.styles.css';
import { Card, CardPlaylist, CardArtist, CardAlbum } from '../index';

export const DisplayFull = (props) => {
  const { title, data, type, children } = props;

  return (
    <div className="main__full">
      <div className="main__full--header">
        <h2>{title}</h2>
      </div>
      <div className="main__full--main">
        {children}
        {data ? (
          data.map((e, index) => {
            if (type == 'card') return <Card itemInfo={e} key={index} />;
            if (type == 'playlist') {
              return <CardPlaylist itemInfo={e} key={index} />;
            }
            if (type == 'artists') {
              return <CardArtist itemInfo={e} key={index} />;
            }
            if (type == 'albums') {
              return <CardAlbum itemInfo={e} key={index} />;
            }
          })
        ) : (
          <h1>loading</h1>
        )}
      </div>
    </div>
  );
};
