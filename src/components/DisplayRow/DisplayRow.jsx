import React, { useEffect, useState, useContext, useRef } from 'react';
import './DisplayRow.styles.css';
import {
  Card,
  CardPlaylist,
  CardArtist,
  CardAlbum,
  CardCategory,
} from '../index';

export const DisplayRow = (props) => {
  const { title, data, type } = props;
  const rowRef = useRef(null);
  const [itensLength, setItensLength] = useState('');
  const [newArray, setNewArray] = useState(
    data.filter((e, index) => index < itensLength - 1),
  );

  const handleLength = () => {
    if (Math.floor(rowRef.current.offsetWidth / 204) != itensLength) {
      setItensLength(Math.floor(rowRef.current.offsetWidth / 204));
    }
  };

  useEffect(() => {
    if (!itensLength) {
      setItensLength(Math.floor(rowRef.current.offsetWidth / 204));
    }

    window.addEventListener('resize', () => handleLength());
    return () => {
      window.removeEventListener('resize', () => handleLength());
    };
  });

  useEffect(() => {
    if (itensLength < 2) return data.filter((e) => e == 0);
    if (data) {
      setNewArray(data.filter((e, index) => index < itensLength - 1));
    }
  }, [itensLength, data]);

  return (
    <div ref={rowRef} className="main__row">
      <div className="main__row--header">
        <h2>{title}</h2>
      </div>
      <div className="main__row--main">
        {newArray ? (
          newArray.map((e, index) => {
            if (type == 'card') return <Card itemInfo={e} key={index} />;
            if (type == 'playlists') {
              return <CardPlaylist itemInfo={e} key={index} />;
            }
            if (type == 'artists') {
              return <CardArtist itemInfo={e} key={index} />;
            }
            if (type == 'albums') {
              return <CardAlbum itemInfo={e} key={index} />;
            }
            if (type == 'category') {
              return <CardCategory itemInfo={e} key={index} />;
            }
          })
        ) : (
          <h1>loading</h1>
        )}
      </div>
    </div>
  );
};
