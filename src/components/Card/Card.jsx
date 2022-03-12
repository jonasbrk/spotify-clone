import React, { memo, useContext, useEffect, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { CreateContext } from '../../pages/home/Home';
import { Player } from '../Player/Player';
import { SpotifyApi } from '../../utils/getByToken';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

export const Card = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);

  const { itemInfo } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = () => {
    console.log(currentDeviceId);
    if (currentTrack.uri != itemInfo.uri) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          context_uri: itemInfo.album.uri,
          offset: { position: itemInfo.track_number - 1 },
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
        <img src={itemInfo.album.images[1].url} alt="" />
        <Button
          onClick={() => {
            handlePlay();
            console.log(itemInfo.id);
            console.log(itemInfo.album.id);
            console.log(currentTrack.id);
            console.log(currentTrack);
            console.log(itemInfo);
            console.log(itemInfo);
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
          {itemInfo.album.href ? (
            <a href={itemInfo.album.href}>{itemInfo.name}</a>
          ) : (
            itemInfo.album.name
          )}
        </span>
        <span className="card__autor">
          {itemInfo.artists.map((e, index) => {
            return (
              <a key={index} href={e.href}>
                {e.name}
              </a>
            );
          })}
        </span>
      </div>
    </div>
  );
};