import React, { useContext, useEffect, useState } from 'react';
import './VolumeButton.styles.css';
import { Button, RangeSlider } from '..';
import {
  VolumeHightImg,
  VolumeLowImg,
  VolumeMediumImg,
  VolumeMuteImg,
} from '../../assets/svg/index';
import { CreateContext } from '../../pages/home/Home';

export const VolumeButton = () => {
  const [volume, setVolume] = useState(50);
  const [volumeImg, setVolumeImg] = useState(<VolumeMediumImg />);
  const [progress, setProgress] = useState(50);
  const [buttonClick, setButtonClick] = useState(false);
  const { player } = useContext(CreateContext);

  useEffect(() => {
    if (player) {
      player.getVolume().then((volume) => {
        setVolume(volume);
        console.log(`The volume of the player is ${volume}%`);
      });
    }
  }, [player]);

  const handleVolume = (e) => {
    setVolume(e);

    setButtonClick(false);
  };

  useEffect(() => {
    const percentage = (((buttonClick ? 0 : volume) * 100) / 100).toFixed(4);
    setProgress(percentage);
    if (player) {
      player.setVolume((buttonClick ? 0 : volume) / 100).then(() => {
        console.log('Volume updated!');
        if (percentage < 1) setVolumeImg(<VolumeMuteImg />);
        if (percentage >= 1 && percentage <= 33) setVolumeImg(<VolumeLowImg />);
        if (percentage > 33 && percentage < 66)
          setVolumeImg(<VolumeMediumImg />);
        if (percentage >= 66) setVolumeImg(<VolumeHightImg />);
      });
    }
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
