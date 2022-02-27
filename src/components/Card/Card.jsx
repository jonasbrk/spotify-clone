import React from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg } from '../../assets/svg';

export const Card = (props) => {
  const { itemInfo } = props;
  return (
    <div className="card__type--song">
      <div className="card__img">
        <img src={itemInfo.imgLargeUrl} alt="" />
        <Button type="player" custom="play--buton--card" src={<PlayImg />} />
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
