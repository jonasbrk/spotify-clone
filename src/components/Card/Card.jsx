import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, setMenssage } from '..';
import { PlayImg, Pause, SongImg } from '../../assets/svg';
import { requestWithToken } from '../../utils/';
import {
  DeviceContext,
  Menssage,
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
  const { setMenssage } = useContext(Menssage);
  const { data } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const { id, uri, name, type } = data;
  const cardRef = useRef(null);

  const convertUri = (uri) => uri.substr(7, uri.length).replaceAll(':', '/');

  const handlePlay = async () => {
    if (!currentTrack || currentTrack.uri != uri) {
      const options = {
        context_uri: type == 'track' ? data.album.uri : uri,
        offset: {
          position: type == 'track' ? data.track_number - 1 : 0,
        },
        position_ms: 0,
      };
      const options_artist = {
        context_uri: type == 'track' ? data.album.uri : uri,
        position_ms: 0,
      };

      try {
        const response = await requestWithToken(
          'PUT',
          'https://api.spotify.com/v1/me/player/play?device_id=' +
            currentDeviceId,
          accessToken,
          type == 'artist' ? options_artist : options,
        );

        if (response.status === 204) {
          console.log('Playing ' + data.name);
        } else {
          setMenssage({
            text: 'Opps, something went wrong!',
            type: 'important',
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      player.togglePlay().then(() => {
        console.log('Toggled playback!');
      });
    }
  };

  useEffect(() => {
    if (
      (currentTrack && currentTrack.uri == uri && currentTrack.play) ||
      (currentTrack && currentTrack.context.uri == uri && currentTrack.play)
    ) {
      setIsPlaying(true);
    } else setIsPlaying(false);
  }, [currentTrack]);

  const navigate = useNavigate();

  const navigateTo = (id, target) => {
    if (
      (cardRef.current && target.className == cardRef.current.className) ||
      target.offsetParent.className == 'card__img' ||
      target.offsetParent.className == 'card__img__wrapper'
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
        <div className="card__img__wrapper">
          {type == 'playlist' && data.images == undefined ? (
            <div className="undefined__cover--card">
              <div className="undefined__icon">
                <SongImg />
              </div>
            </div>
          ) : (
            <img
              src={
                type == 'track' ? data.album.images[0].url : data.images[0].url
              }
              alt=""
            />
          )}
        </div>

        {!(type == 'artist') && (
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
        )}
      </div>
      <div className="card__info">
        <span className="card__title">
          <Link
            to={data.album ? convertUri(data.album.uri) : convertUri(data.uri)}
          >
            {name}
          </Link>
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
