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
  Pause,
} from '../../assets/svg/index';

export const Player = () => {
  const [audioMinLength, setAudioMinLength] = useState(0);
  const [audioMaxLength, setAudioMaxLength] = useState(195);
  const [audioPlayedLength, setAudioPlayedLength] = useState(0);
  const [audioValue, setAudioValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const { coverOpen, setCoverOpen, isPlaying } = useContext(CreateContext);

  const handleProgressValue = (value) => {
    setAudioValue(value);
    setAudioPlayedLength((value / 60000).toFixed(2).replace('.', ':'));
  };

  useEffect(() => {
    handleProgressValue(isPlaying.playedTime);
    setAudioMaxLength(
      (isPlaying.timeLength / 60000).toFixed(2).replace('.', ':'),
    );
  }, [isPlaying]);

  useEffect(() => {
    const percentage = ((audioValue * 100) / isPlaying.timeLength).toFixed(4);
    setProgress(percentage);
  }, [audioValue, isPlaying]);
  return (
    <div className="player">
      <div
        className={`player__display ${coverOpen && 'player__display--close'}`}
      >
        <SongButton isPlaying={isPlaying} />
        <Button type="player" src={<LikeImg />} />
        <Button type="player" src={<ScreenImg />} />
      </div>
      <div className="player__controls">
        <div className="player__section--1">
          <Button type="player" src={<RandomImg />} />
          <Button type="player" src={<BackTrackImg />} />
          <Button
            type="player"
            custom="Play--buton"
            src={isPlaying.isPlaying ? <PlayImg /> : <Pause />}
          />
          <Button type="player" src={<NextTrackImg />} />
          <Button type="player" src={<LoopTrackImg />} />
        </div>
        <div className="player__section--2">
          <div className="time-section--1">{audioPlayedLength}</div>
          <RangeSlider
            inputMin={audioMinLength}
            inputMax={isPlaying.timeLength}
            handle={handleProgressValue}
            progress={progress}
            inputValue={audioValue}
          />
          <div className="time-section--2">{audioMaxLength}</div>
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
