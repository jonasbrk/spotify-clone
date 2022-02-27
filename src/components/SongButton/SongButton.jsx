import React, { useContext } from 'react';
import './SongButton.styles.css';
import { Button } from '..';
import { ArrowUpImg } from '../../assets/svg/index';
import { CreateContext } from '../../pages/home/Home';

export const SongButton = (props) => {
  const { src } = props;
  const { coverOpen, setCoverOpen } = useContext(CreateContext);
  return (
    <>
      <div className="song__cover">
        <img className="song__img" src={src} alt="" />
        <Button
          onClick={() => setCoverOpen((coverOpen) => !coverOpen)}
          type="icon"
          custom="expand__cover"
          src={<ArrowUpImg />}
        />
      </div>
      <div className="song__info">
        <span className="song__title">
          <a href="">Title</a>{' '}
        </span>
        <span className="song__autor">
          <a href="">autor</a>{' '}
        </span>
      </div>
    </>
  );
};
