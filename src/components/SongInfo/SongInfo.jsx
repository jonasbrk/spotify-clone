import React, { useContext } from 'react';
import './SongInfo.styles.css';
import { Button } from '..';
import { ArrowUpImg } from '../../assets/svg/index';
import { isCoverOpen, TrackContext } from '../../utils/context';

export const SongInfo = (props) => {
  const { src } = props;
  const { coverOpen, setCoverOpen } = useContext(isCoverOpen);
  const { currentTrack } = useContext(TrackContext);
  return (
    <>
      <div className="song__cover">
        <img
          className="song__img"
          src={currentTrack && currentTrack.album.images[1].url}
          alt=""
        />
        <Button
          onClick={() => setCoverOpen((coverOpen) => !coverOpen)}
          type="icon"
          custom="expand__cover"
          src={<ArrowUpImg />}
        />
      </div>
      <div className="song__info">
        <span className="song__title">
          <a href="">{currentTrack && currentTrack.name}</a>
        </span>
        <span className="song__autor">
          <a href="">{currentTrack && currentTrack.artists[0].name}</a>
        </span>
      </div>
    </>
  );
};
