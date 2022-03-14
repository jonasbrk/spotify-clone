import React, { useEffect, useState, useContext, useRef } from 'react';
import './Player.styles.css';
import {
  Button,
  VolumeButton,
  SongInfo,
  DeviceButton,
  Controls,
  PlaybackProgress,
} from '..';
import {
  DeviceContext,
  isCoverOpen,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { QueueImg, LikeImg } from '../../assets/svg/index';
import axios from 'axios';

export const Player = (props) => {
  const [playbackState, setPlaybackState] = useState('');

  const { accessToken } = useContext(TokenContext);
  const { coverOpen } = useContext(isCoverOpen);
  const { setPlayer } = useContext(PlayerContext);
  const { currentTrack, setCurrentTrack } = useContext(TrackContext);
  const { setCurrentDeviceId } = useContext(DeviceContext);

  const getPlayerInfo = () => {
    const getFunc = async () => {
      try {
        const response = await axios.get(
          'https://api.spotify.com/v1/me/player',
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        );
        if (response.status === 200) {
          const { data } = response;
          const { is_playing, item, progress_ms, repeat_state, shuffle_state } =
            data;
          setCurrentTrack({ ...item, play: is_playing });
          setPlaybackState((state) => ({
            ...state,
            play: is_playing,
            shuffle: shuffle_state,
            repeat_state: repeat_state !== 'off',
            duration: item.duration_ms,
            progress: progress_ms,
          }));
        } else if (response.status === 204) {
          console.log(
            'Please select a device to start listening on SPOTIFY CLONE',
          );
        } else {
          console.log('Error from Spotify Server');
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFunc();
  };

  const loadScript = () => {
    const script = document.createElement('script');
    script.id = 'spotify-player';
    script.type = 'text/javascript';
    script.async = 'async';
    script.defer = 'defer';
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.body.appendChild(script);
  };
  const InitializePlayer = () => {
    console.log('initializing Spotify Clone');
    const player = new window.Spotify.Player({
      name: 'Spotify Clone',
      getOAuthToken: (cb) => {
        cb(accessToken);
      },
      volume: 0.5,
    });
    setPlayer(player);
    console.log(player);
    // Error handling
    player.addListener('initialization_error', ({ message }) => {
      console.log(message);
    });
    player.addListener('authentication_error', ({ message }) => {
      console.log(message);
    });
    player.addListener('account_error', ({ message }) => {
      console.log(message);
    });
    player.addListener('playback_error', ({ message }) => {
      console.log(message);
    });
    // Playback status updates
    player.addListener('player_state_changed', (state) => {
      try {
        if (state) {
          const {
            duration,
            loading,
            paused,
            position,
            repeat_mode,
            shuffle,
            track_window,
          } = state;
          const { current_track, previous_tracks, next_tracks } = track_window;
          setCurrentTrack({ ...current_track, play: !paused });
          console.log(repeat_mode);
          setPlaybackState((state) => ({
            ...state,
            loading: loading,
            play: !paused,
            shuffle: shuffle,
            repeat_state: repeat_mode !== 0,
            progress: position,
            duration: duration,
            track_window: {
              current_track: current_track,
              previous_tracks: [...previous_tracks, previous_tracks],
              next_tracks: [...next_tracks, next_tracks],
            },
          }));
        }
      } catch (error) {
        console.log(error);
      }
    });
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setCurrentDeviceId(device_id);
    });
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
    // Connect the player!
    player.connect();
  };

  useEffect(() => {
    // initialize script
    if (accessToken) {
      loadScript();
      getPlayerInfo();
      window.onSpotifyWebPlaybackSDKReady = () => InitializePlayer();
      // get current state of the player
    }
    // eslint-disable-next-line
}, [accessToken]);

  return (
    <div className="player">
      <div
        className={`player__display ${coverOpen && 'player__display--close'}`}
      >
        {currentTrack && (
          <>
            <SongInfo />
            <Button type="player" src={<LikeImg />} />
          </>
        )}
      </div>
      <div className="player__controls">
        <Controls playbackState={playbackState} />
        <PlaybackProgress playbackState={playbackState} />
      </div>
      <div className="player__options">
        <Button type="player" src={<QueueImg />} />
        <DeviceButton />
        <VolumeButton />
      </div>
    </div>
  );
};
