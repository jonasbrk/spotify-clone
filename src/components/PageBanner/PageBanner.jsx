import React from 'react';
import './PageBanner.styles.css';
import { Pause, PlayImg } from '../../assets/svg';
import { Button } from '../';
export const PageBanner = ({ pageData, play }) => {
  const { color, title, description, name, cover, type, owner } = pageData;
  const [handlePlay, isPlaying] = play;
  return (
    <>
      <div className="pageBanner">
        <div
          className="pageBanner__color"
          style={{ backgroundColor: color }}
        ></div>
        <div className="pageBanner__gradient"></div>
        {owner.type != 'artist' && (
          <div className="cover__container">
            <img src={cover[0].url} />
          </div>
        )}
        <div className="info__container">
          <div className="page__type">
            <span>{title}</span>
          </div>
          <div className="page__name">
            <h2>{name}</h2>
          </div>
          <div className="page__info">
            <span>{owner.type != 'artist' && owner.display_name}</span>
          </div>
        </div>
      </div>
      <div className="pageBanner__buttons">
        <div
          className="pageBanner__buttons__gradient"
          style={{ backgroundColor: color }}
        ></div>
        <Button
          onClick={() => {
            handlePlay();
          }}
          type="player"
          custom={`play--buton--pageBanner ${
            isPlaying && 'play--buton--pageBanner--active'
          }`}
          src={isPlaying ? <Pause /> : <PlayImg />}
        />
      </div>
    </>
  );
};
