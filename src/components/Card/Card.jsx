import React, { memo, useContext, useEffect, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { CreateContext } from '../../pages/home/Home';

export const Card = (props) => {
  const { setIsPlaying } = useContext(CreateContext);
  const { itemInfo } = props;

  return (
    <div className="card__type--song">
      <div className="card__img">
        <img src={itemInfo.album.images[1].url} alt="" />
        <Button
          onClick={() => {
            setIsPlaying(itemInfo);
          }}
          type="player"
          custom={`play--buton--card ${
            !itemInfo.isPlaying && 'play--buton--card--playing'
          }`}
          src={itemInfo.isPlaying ? <PlayImg /> : <Pause />}
        />
      </div>
      <div className="card__info">
        <span className="card__title">
          {itemInfo.album.href ? (
            <a href={itemInfo.album.href}>{itemInfo.album.name}</a>
          ) : (
            itemInfo.album.name
          )}
        </span>
        <span className="card__autor">
          {itemInfo.album.artists.href ? (
            <a href={itemInfo.album.artists.href}>
              {itemInfo.album.artists[0].name}
            </a>
          ) : (
            itemInfo.album.artists[0].name
          )}
        </span>
      </div>
    </div>
  );
};
