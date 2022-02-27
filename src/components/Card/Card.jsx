import React, { useContext } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { CreateContext } from '../../pages/home/Home';
Pause;
export const Card = (props) => {
  const { setIsPlaying } = useContext(CreateContext);
  const { itemInfo } = props;
  return (
    <div className="card__type--song">
      <div className="card__img">
        <img src={itemInfo.imgLargeUrl} alt="" />
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
          {itemInfo.titleUrl ? <a href="">{itemInfo.title}</a> : itemInfo.title}
        </span>
        <span className="card__autor">
          {itemInfo.descriptionUrl ? (
            <a href="">{itemInfo.description}</a>
          ) : (
            itemInfo.description
          )}
        </span>
      </div>
    </div>
  );
};
