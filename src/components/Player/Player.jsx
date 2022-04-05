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
  Menssage,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { QueueImg, LikeImg } from '../../assets/svg/index';
import axios from 'axios';
import { requestWithToken } from '../../utils';

export const Player = () => {
  const { accessToken } = useContext(TokenContext);
  const { setPlayer } = useContext(PlayerContext);
  const { setCurrentDeviceId } = useContext(DeviceContext);
  const { currentTrack, setCurrentTrack } = useContext(TrackContext);
  const { setMenssage } = useContext(Menssage);
  const [playbackState, setPlaybackState] = useState('');
  const { coverOpen } = useContext(isCoverOpen);
  const [isLiked, setIsLiked] = useState(false);

  const getPlayerInfo = () => {
    const getFunc = async () => {
      try {
        const response = await requestWithToken(
          'GET',
          'https://api.spotify.com/v1/me/player',
          accessToken,
        );
        if (response.status === 200) {
          const {
            is_playing,
            item,
            progress_ms,
            repeat_state,
            shuffle_state,
            context,
          } = response.data;
          setCurrentTrack({ ...item, play: is_playing, context: context });
          setPlaybackState((state) => ({
            ...state,
            shuffle: shuffle_state,
            repeat_state: repeat_state !== 'off',
            progress: progress_ms,
          }));
        } else if (response.status === 204) {
          setMenssage({
            text: 'Please select a device to start listening on SPOTIFY CLONE',
          });
        } else {
          setMenssage({
            text: 'Error from Spotify Server',
          });
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
            loading,
            paused,
            position,
            repeat_mode,
            shuffle,
            track_window,
            context,
          } = state;

          const { current_track } = track_window;
          if (!loading) {
            setCurrentTrack({
              ...current_track,
              play: !paused,
              context: context,
            });
          }

          setPlaybackState((state) => ({
            ...state,
            loading: loading,
            shuffle: shuffle,
            repeat_state: repeat_mode !== 0,
            progress: position,
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

  useEffect(async () => {
    if (currentTrack) {
      try {
        const response = await requestWithToken(
          'GET',
          'https://api.spotify.com/v1/me/tracks/contains?ids=' +
            currentTrack.id,
          accessToken,
        );
        if (response.status == 200) {
          setIsLiked(response.data[0]);
        } else {
          setMenssage({
            text: 'Opps, something went wrong!',
            type: 'important',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentTrack]);

  const handleLikeSong = async () => {
    try {
      const response = await requestWithToken(
        isLiked ? 'DELETE' : 'PUT',
        'https://api.spotify.com/v1/me/tracks?ids=' + currentTrack.id,
        accessToken,
      );

      if (response.status === 200) {
        setIsLiked(!isLiked);
        setMenssage({
          text: !isLiked
            ? 'Adicionado à sua biblioteca'
            : 'Removido de sua biblioteca',
        });
      } else {
        setMenssage({
          text: 'Opps, something went wrong!',
          type: 'important',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="player">
      <div
        className={`player__display ${coverOpen && 'player__display--close'}`}
      >
        {currentTrack && (
          <>
            {currentTrack && <SongInfo />}
            <Button
              type="player"
              src={<LikeImg />}
              custom={isLiked && 'liked'}
              onClick={() => handleLikeSong()}
            />
          </>
        )}
      </div>
      <div
        className={` player__controls ${
          !currentTrack && 'player__controls__disabled'
        }`}
      >
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
