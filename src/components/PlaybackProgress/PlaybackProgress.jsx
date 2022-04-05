import React, { useContext, useState, useEffect } from 'react';
import { PlayerContext, TrackContext } from '../../utils/context';
import { useMinutesString } from '../../utils/useMinutesString';
import { RangeSlider } from '..';
import './PlaybackProgress.styles.css';

export const PlaybackProgress = (props) => {
  const { playbackState } = props;
  const { player } = useContext(PlayerContext);
  const { currentTrack } = useContext(TrackContext);

  const [audioMaxLength, setAudioMaxLength] = useState(useMinutesString(0));
  const [audioPlayedLength, setAudioPlayedLength] = useState(
    useMinutesString(0),
  );
  const [audioValue, setAudioValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleProgressValue = (value) => {
    setAudioValue(Number(value));
  };

  useEffect(() => {
    if (playbackState.loading) {
      setAudioValue(playbackState.progress);
      setAudioMaxLength(useMinutesString(currentTrack.duration_ms));
    }
  }, [currentTrack]);

  useEffect(() => {
    const percentage = ((audioValue * 100) / currentTrack.duration_ms).toFixed(
      4,
    );
    setProgress(percentage);
    setAudioPlayedLength(useMinutesString(audioValue));
  }, [audioValue]);

  const onMouseUp = () => {
    player.seek(audioValue).then(() => {
      console.log('Changed position!');
      setIsDragging(false);
    });
  };

  useEffect(() => {
    if (
      currentTrack.play &&
      audioValue <= currentTrack.duration_ms &&
      !isDragging
    ) {
      const Counter = setTimeout(() => {
        player.getCurrentState().then((state) => {
          setAudioValue(state.position);
        });
      }, 1000);
      return () => {
        clearTimeout(Counter);
      };
    }
  }, [audioValue, currentTrack.play, isDragging]);

  return (
    <div className="player__section--2">
      <div className="time-section--1">{audioPlayedLength}</div>
      <RangeSlider
        inputMin={0}
        inputMax={currentTrack.duration_ms}
        handle={handleProgressValue}
        progress={progress}
        inputValue={audioValue}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => onMouseUp()}
      />
      <div className="time-section--2">{audioMaxLength}</div>
    </div>
  );
};
