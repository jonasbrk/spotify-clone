import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';

export const CardPlaylist = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { itemInfo } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);

  const handlePlay = () => {
    console.log(currentTrack);
    if (currentTrack.context.uri != itemInfo.uri || currentTrack.init_load) {
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
    if (currentTrack.context.uri == itemInfo.uri && currentTrack.play) {
      setIsPlaying(true);
    } else setIsPlaying(false);
  }, [currentTrack]);

  const navigate = useNavigate();

  const navigateTo = (id, target) => {
    console.log(cardRef, target);
    if (
      (cardRef.current &&
        target.target.className == cardRef.current.className) ||
      target.target.offsetParent.className == 'card__img'
    ) {
      navigate('/playlist/' + id);
    }
  };
  return (
    <div
      onClick={(e) => {
        navigateTo(itemInfo.id, e);
      }}
      className="card__type--song"
      ref={cardRef}
    >
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
          <Link to={`/playlist/${itemInfo.id}`}>{itemInfo.name}</Link>
        </span>
        <span className="card__autor">
          {itemInfo.description && itemInfo.description}
        </span>
      </div>
    </div>
  );
};
