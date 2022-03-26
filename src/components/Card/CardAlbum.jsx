import React, { useContext, useEffect, useRef, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { SpotifyApi } from '../../utils/';
import { Link, useNavigate } from 'react-router-dom';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

export const CardAlbum = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { itemInfo } = props;
  const [isPlaying, setIsPlaying] = useState(false);

  const cardRef = useRef(null);
  const handlePlay = (e) => {
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

  const navigate = useNavigate();

  const navigateTo = (url, target) => {
    if (
      (cardRef.current &&
        target.target.className == cardRef.current.className) ||
      target.target.offsetParent.className == 'card__img'
    ) {
      navigate('/album/' + url);
    }
  };

  return (
    <div
      ref={cardRef}
      className="card__type--song"
      onClick={(e) => {
        navigateTo(itemInfo.id, e);
      }}
    >
      <div className="card__img">
        <img src={itemInfo.images[1].url} alt="" />
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
          <Link to={`/album/${itemInfo.id}`}>{itemInfo.name}</Link>
        </span>
        <span className="card__autor">
          {itemInfo.artists.map((e, index) => (
            <>
              {e.name}
              {index < itemInfo.artists.length - 1 && ', '}
            </>
          ))}
        </span>
      </div>
    </div>
  );
};
