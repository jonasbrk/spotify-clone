import React, { useEffect, useState, useContext, useRef } from 'react';
import './Player.styles.css';
import {
  Button,
  RangeSlider,
  VolumeButton,
  SongButton,
  DeviceButton,
} from '..';
import {
  DeviceContext,
  isCoverOpen,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import {
  RandomImg,
  BackTrackImg,
  PlayImg,
  NextTrackImg,
  LoopTrackImg,
  QueueImg,
  LikeImg,
  Pause,
} from '../../assets/svg/index';
import { SpotifyApi } from '../../utils/getByToken';
import { useMinutesString } from '../../utils/useMinutesString';
import axios from 'axios';

export const Player = (props) => {
  const [audioMaxLength, setAudioMaxLength] = useState(useMinutesString(0));
  const [audioPlayedLength, setAudioPlayedLength] = useState(0);
  const [audioValue, setAudioValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackState, setPlaybackState] = useState('');

  const { accessToken } = useContext(TokenContext);
  const { coverOpen } = useContext(isCoverOpen);
  const { player, setPlayer } = useContext(PlayerContext);
  const { currentTrack, setCurrentTrack } = useContext(TrackContext);
  const { currentDeviceId, setCurrentDeviceId } = useContext(DeviceContext);

  const handleProgressValue = (value) => {
    setAudioValue(Number(value));
  };

  useEffect(() => {
    if (playbackState.loading) {
      setAudioValue(playbackState.progress);
      setAudioMaxLength(useMinutesString(currentTrack.duration_ms));
    }
  }, [playbackState]);

  useEffect(() => {
    const percentage = ((audioValue * 100) / currentTrack.duration_ms).toFixed(
      4,
    );
    setProgress(percentage);
    setAudioPlayedLength(useMinutesString(audioValue));
  }, [audioValue]);

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
    // return () => {
    //   player.disconnect();
    // };
    // eslint-disable-next-line
}, [accessToken]);



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
  }, [audioValue, playbackState.play, isDragging]);

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
    <div className="player">
      <div
        className={`player__display ${coverOpen && 'player__display--close'}`}
      >
        {currentTrack && (
          <>
            <SongButton />
            <Button type="player" src={<LikeImg />} />
          </>
        )}
      </div>
      <div className="player__controls">
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
      </div>
      <div className="player__options">
        <Button type="player" src={<QueueImg />} />
        <DeviceButton />
        <VolumeButton />
      </div>
    </div>
  );
};
