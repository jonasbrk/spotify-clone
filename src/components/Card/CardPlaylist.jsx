import React, { useContext, useEffect, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { SpotifyApi } from '../../utils/';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

export const CardPlaylist = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { itemInfo } = props;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    console.log(currentTrack);
    if (currentTrack.uri != itemInfo.uri || currentTrack.init_load) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          context_uri: itemInfo.uri,
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

  return (
    <div className="card__type--song">
      <div className="card__img">
        <img src={itemInfo.images[0].url} alt="" />
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
      </div>
      <div className="card__info">
        <span className="card__title">
          {itemInfo.href ? (
            <a href={itemInfo.href}>{itemInfo.name}</a>
          ) : (
            itemInfo.name
          )}
        </span>
        <span className="card__autor">{itemInfo.description}</span>
      </div>
    </div>
  );
};
