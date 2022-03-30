import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { SpotifyApi } from '../../utils/';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

import './Card.styles.css';

export const Card = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { data } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const { id, uri, name, type } = data;
  const cardRef = useRef(null);

  const handlePlay = () => {
    if (currentTrack.uri != uri) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          context_uri: type == 'track' ? data.album.uri : uri,
          offset: { position: type == 'track' ? data.track_number - 1 : 0 },
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
    if (currentTrack.uri == uri && currentTrack.play) {
      setIsPlaying(true);
    } else setIsPlaying(false);
  }, [currentTrack]);

  const navigate = useNavigate();

  const navigateTo = (id, target) => {
    if (
      (cardRef.current && target.className == cardRef.current.className) ||
      target.offsetParent.className == 'card__img'
    ) {
      navigate(`/${type == 'track' ? 'album' : type}/${id}`);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`card__type--song ${type == 'artist' && 'card__type--artist'}`}
      onClick={(event) => {
        navigateTo(type == 'track' ? data.album.id : id, event.target);
      }}
    >
      <div className="card__img">
        <img
          src={type == 'track' ? data.album.images[0].url : data.images[0].url}
          alt=""
        />
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
          <Link to={`/album/${id}`}>{name}</Link>
        </span>
        <span className="card__descripton">
          {data.description && data.description}
          {type == 'artist' && 'Artist'}
          {data.artists &&
            data.artists.map((e, index) => (
              <>
                {e.name}
                {index < data.artists.length - 1 && ', '}
              </>
            ))}
        </span>
      </div>
    </div>
  );
};
