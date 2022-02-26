import React from 'react';
import './Player.styles.css';
import { Button, RangeSlider } from '..';
import {
  RandomImg,
  BackTrackImg,
  PlayImg,
  NextTrackImg,
  LoopTrackImg,
  MicImg,
  QueueImg,
  PcImg,
  LikeImg,
  ScreenImg,
} from '../../assets/svg/index';

export const Player = () => {
  return (
    <div className="player">
      <div className="player__display">
        <Button type="player" src={<LikeImg />} />
        <Button type="player" src={<ScreenImg />} />
      </div>
      <div className="player__controls">
        <div className="player__section--1">
          <Button type="player" src={<RandomImg />} />
          <Button type="player" src={<BackTrackImg />} />
          <Button type="player" custom="Play--buton" src={<PlayImg />} />
          <Button type="player" src={<NextTrackImg />} />
          <Button type="player" src={<LoopTrackImg />} />
        </div>
        <div className="player__section--2">
          <RangeSlider />
        </div>
      </div>
      <div className="player__options">
        <Button type="player" src={<MicImg />} />
        <Button type="player" src={<QueueImg />} />
        <Button type="player" src={<PcImg />} />
      </div>
    </div>
  );
};
