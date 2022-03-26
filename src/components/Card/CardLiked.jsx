import React, { useContext, useEffect, useRef, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { SpotifyApi } from '../../utils';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { Link, useNavigate } from 'react-router-dom';

export const CardLiked = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { itemInfo } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);

  const handlePlay = () => {
    console.log(currentTrack);
    if (
      !itemInfo.tracks
        .map((e) => {
          return e.uri;
        })
        .includes(currentTrack.uri) ||
      currentTrack.init_load
    ) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          uris: itemInfo.tracks.map((e) => {
            return e.uri;
          }),
          offset: { position: 0 },
          position_ms: 0,
        },
      );
    } else {
      player.togglePlay().then(() => {
        console.log('Toggled playback!');
      });
    }
  };

  useEffect(() => {
    if (currentTrack.uri == itemInfo.uri && currentTrack.play) {
      setIsPlaying(true);
    } else setIsPlaying(false);
  }, [currentTrack]);

  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        navigate('/collection/tracks');
      }}
      className="card__type--song card__type--liked"
      ref={cardRef}
    >
      <Button
        onClick={() => {
          handlePlay();
        }}
        type="player"
        custom={`play--buton--card ${
          isPlaying && 'play--buton--card--playing'
        }`}
        src={isPlaying ? <Pause /> : <PlayImg />}
      />

      <div className="card__info">
        <span className="card__title">{itemInfo.name}</span>
        <span className="card__autor">
          {itemInfo.tracks.length + ' músicas curtidas'}
        </span>
      </div>
    </div>
  );
};
