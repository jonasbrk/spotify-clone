import React, { useState } from 'react';
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
  const [audioMinLength, setAudioMinLength] = useState(0);
  const [audioMaxLength, setAudioMaxLength] = useState(195);
  const [audioPlayedLength, setAudioPlayedLength] = useState(0);

  const handleProgressValue = (value) => {
    setAudioPlayedLength((value / 60).toFixed(2));
  };
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
          <div className="time-section--1">{audioPlayedLength}</div>
          <RangeSlider
            inputMin={audioMinLength}
            inputMax={audioMaxLength}
            handle={handleProgressValue}
          />
          <div className="time-section--2">{audioMaxLength / 60}</div>
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
