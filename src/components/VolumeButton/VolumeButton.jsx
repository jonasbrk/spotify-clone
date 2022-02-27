import React, { useEffect, useState } from 'react';
import './VolumeButton.styles.css';
import { Button, RangeSlider } from '..';
import {
  VolumeHightImg,
  VolumeLowImg,
  VolumeMediumImg,
  VolumeMuteImg,
} from '../../assets/svg/index';

export const VolumeButton = () => {
  const [volume, setVolume] = useState(50);
  const [volumeImg, setVolumeImg] = useState(50);
  const [progress, setProgress] = useState(50);
  const [buttonClick, setButtonClick] = useState(false);

  const handleVolume = (e) => {
    setVolume(e);
    setButtonClick(false);
  };

  useEffect(() => {
    const percentage = (((buttonClick ? 0 : volume) * 100) / 100).toFixed(4);
    setProgress(percentage);
    if (percentage < 1) setVolumeImg(<VolumeMuteImg />);
    if (percentage >= 1 && percentage <= 33) setVolumeImg(<VolumeLowImg />);
    if (percentage > 33 && percentage < 66) setVolumeImg(<VolumeMediumImg />);
    if (percentage >= 66) setVolumeImg(<VolumeHightImg />);
    console.log(volume);
  }, [volume, buttonClick]);

  return (
    <div className="volume__button">
      <Button
        type="player"
        onClick={() => setButtonClick((buttonClick) => !buttonClick)}
        src={volumeImg}
      />
      <RangeSlider
        inputValue={volume}
        inputMin={0}
        inputMax={100}
        handle={handleVolume}
        progress={progress}
      />
    </div>
  );
};
