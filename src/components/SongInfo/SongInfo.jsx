import React, { useContext } from 'react';
import './SongInfo.styles.css';
import { Button } from '..';
import { ArrowUpImg } from '../../assets/svg/index';
import { isCoverOpen, TrackContext } from '../../utils/context';

export const SongInfo = () => {
  const { setCoverOpen } = useContext(isCoverOpen);
  const { currentTrack } = useContext(TrackContext);
  return (
    <>
      <div className="song__player__cover">
        <img
          className="song__player__img"
          src={currentTrack.album.images[1].url}
          alt=""
        />
        <Button
          onClick={() => setCoverOpen((coverOpen) => !coverOpen)}
          type="icon"
          custom="expand__song__player__cover"
          src={<ArrowUpImg />}
        />
      </div>
      <div className="song__player__info">
        <span className="song__player__title">
          <a href="">{currentTrack.name}</a>
        </span>
        <span className="song__player__autor">
          <a href="">{currentTrack.artists[0].name}</a>
        </span>
      </div>
    </>
  );
};
