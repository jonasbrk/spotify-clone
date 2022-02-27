import React, { useEffect, useState, useContext } from 'react';
import './Player.styles.css';
import { Button, RangeSlider, VolumeButton, SongButton } from '..';
import { CreateContext } from '../../pages/home/Home';
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
  const [AudioValue, setAudioValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const { coverOpen, setCoverOpen } = useContext(CreateContext);

  const handleProgressValue = (value) => {
    setAudioValue(value);
    setAudioPlayedLength((value / 60).toFixed(2));
  };

  useEffect(() => {
    const percentage = ((AudioValue * 100) / audioMaxLength).toFixed(4);
    setProgress(percentage);
  }, [AudioValue]);
  return (
    <div className="player">
      <div
        className={`player__display ${coverOpen && 'player__display--close'}`}
      >
        <SongButton src="https://i.scdn.co/image/ab67616d0000485199b303d231b6c96cef035a6b" />
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
            progress={progress}
            inputValue={AudioValue}
          />
          <div className="time-section--2">{audioMaxLength / 60}</div>
        </div>
      </div>
      <div className="player__options">
        <Button type="player" src={<MicImg />} />
        <Button type="player" src={<QueueImg />} />
        <Button type="player" src={<PcImg />} />
        <VolumeButton />
      </div>
    </div>
  );
};
