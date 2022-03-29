import React, { useContext } from 'react';
import './Controls.styles.css';
import axios from 'axios';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { SpotifyApi } from '../../utils/';
import { Button } from '../';
import {
  RandomImg,
  BackTrackImg,
  PlayImg,
  Pause,
  NextTrackImg,
  LoopTrackImg,
} from '../../assets/svg';

export const Controls = (props) => {
  const { playbackState } = props;
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);

  const handleFunction = (type) => {
    let state = {
      shuffle: !playbackState.shuffle,
      repeat: playbackState.repeat_state ? 'off' : 'track',
    };

    if (currentTrack) {
      SpotifyApi(
        'PUT',
        accessToken,
        `https://api.spotify.com/v1/me/player/${type}?device_id=${currentDeviceId}&state=${state[type]}`,
      );
    }
  };

  return (
    <div
      className={`player__section--1 ${
        !currentTrack && 'player__controls__disabled'
      }`}
    >
      <Button
        type="player"
        src={<RandomImg />}
        onClick={() => handleFunction('shuffle')}
        custom={playbackState.shuffle && 'button__player--active'}
      />
      <Button
        type="player"
        src={<BackTrackImg />}
        onClick={() => {
          currentTrack &&
            player.previousTrack().then(() => {
              console.log('Set to previous track!');
            });
        }}
      />
      <Button
        type="player"
        custom="Play--buton"
        src={!currentTrack.play ? <PlayImg /> : <Pause />}
        onClick={() => {
          currentTrack &&
            player.togglePlay().then(() => {
              console.log('Toggled playback!');
            });
        }}
      />
      <Button
        type="player"
        src={<NextTrackImg />}
        onClick={() => {
          currentTrack &&
            player.nextTrack().then(() => {
              console.log('Skipped to next track!');
            });
        }}
      />
      <Button
        type="player"
        src={<LoopTrackImg />}
        onClick={() => handleFunction('repeat')}
        custom={playbackState.repeat_state && 'button__player--active'}
      />
    </div>
  );
};
