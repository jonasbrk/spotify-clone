import React, { useContext } from 'react';
import './SongButton.styles.css';
import { Button } from '..';
import { ArrowUpImg } from '../../assets/svg/index';
import { CreateContext } from '../../pages/home/Home';

export const SongButton = (props) => {
  const { src } = props;
  const { coverOpen, setCoverOpen, isPlaying } = useContext(CreateContext);
  return (
    <>
      <div className="song__cover">
        <img className="song__img" src={isPlaying.album.images[1].url} alt="" />
        <Button
          onClick={() => setCoverOpen((coverOpen) => !coverOpen)}
          type="icon"
          custom="expand__cover"
          src={<ArrowUpImg />}
        />
      </div>
      <div className="song__info">
        <span className="song__title">
          <a href="">{isPlaying.album.name}</a>
        </span>
        <span className="song__autor">
          <a href="">{isPlaying.album.artists[0].name}</a>
        </span>
      </div>
    </>
  );
};
