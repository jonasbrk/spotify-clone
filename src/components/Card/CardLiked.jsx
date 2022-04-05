import React, { useContext, useEffect, useRef, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { requestWithToken } from '../../utils';
import {
  DeviceContext,
  Menssage,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { useNavigate } from 'react-router-dom';

export const CardLiked = (props) => {
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentTrack } = useContext(TrackContext);
  const { player } = useContext(PlayerContext);
  const { accessToken } = useContext(TokenContext);
  const { setMenssage } = useContext(Menssage);
  const { itemInfo } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);

  const handlePlay = async () => {
    if (
      !currentTrack ||
      !itemInfo.tracks
        .map((e) => {
          return e.uri;
        })
        .includes(currentTrack.uri)
    ) {
      try {
        const response = await requestWithToken(
          'PUT',
          'https://api.spotify.com/v1/me/player/play?device_id=' +
            currentDeviceId,
          accessToken,
          {
            uris: itemInfo.tracks.map((e) => {
              return e.uri;
            }),
            offset: { position: 0 },
            position_ms: 0,
          },
        );
        if (response.status === 204) {
          console.log('Playing liked songs');
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
      currentTrack &&
      itemInfo.tracks
        .map((e) => {
          return e.uri;
        })
        .includes(currentTrack.uri) &&
      currentTrack.play
    ) {
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
      navigate(url);
    }
  };

  return (
    <div
      onClick={(e) => {
        navigateTo('/collection/tracks', e);
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
