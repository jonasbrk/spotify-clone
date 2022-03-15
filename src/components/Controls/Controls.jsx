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

  const handleRepeatMode = () => {
    if (!playbackState.repeat_state) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/repeat?state=context',
      );
    } else {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/repeat?state=off',
      );
    }
    console.log('ativando repeat');
  };

  const handleShuffleMode = () => {
    SpotifyApi(
      'PUT',
      accessToken,
      'https://api.spotify.com/v1/me/player/shuffle?state=' +
        !playbackState.shuffle,
    );

    console.log('ativando repeat');
  };

  const handlePlay = () => {
    if (!playbackState) {
      axios(
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
          data: {
            context_uri: currentTrack.album.uri,
            offset: { position: currentTrack.track_number - 1 },
            position_ms: 0,
          },
          method: 'PUT',
        },
      ).then(() => {
        player.pause().then(() => {
          console.log('Paused!');
        });
      });
    } else {
      player.togglePlay().then(() => {
        console.log('Toggled playback!');
      });
    }
  };
  return (
    <div className="player__section--1">
      <Button
        type="player"
        src={<RandomImg />}
        onClick={() => handleShuffleMode()}
        custom={playbackState.shuffle && 'button__player--active'}
      />
      <Button
        type="player"
        src={<BackTrackImg />}
        onClick={() => {
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
          handlePlay();
        }}
      />
      <Button
        type="player"
        src={<NextTrackImg />}
        onClick={() => {
          player.nextTrack().then(() => {
            console.log('Skipped to next track!');
          });
        }}
      />
      <Button
        type="player"
        src={<LoopTrackImg />}
        onClick={() => handleRepeatMode()}
        custom={playbackState.repeat_state && 'button__player--active'}
      />
    </div>
  );
};
