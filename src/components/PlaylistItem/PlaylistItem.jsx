import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PlaylistItem.styles.css';
import { useMinutesString, useDateFormater } from '../../utils';
import { Button } from '../';
import { PlayImg, Pause } from '../../assets/svg';
import { SpotifyApi } from '../../utils';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

export const PlaylistItem = (props) => {
  const { data, index, playlist } = props;
  const { currentTrack } = useContext(TrackContext);
  const { accessToken } = useContext(TokenContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (currentTrack.uri != data.track.uri || currentTrack.init_load) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          context_uri: playlist.uri,
          offset: { position: index },
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
    if (!currentTrack.init_load) {
      if (currentTrack.uri == data.track.uri && currentTrack.play) {
        setIsPlaying(true);
      } else setIsPlaying(false);
    }
  }, [currentTrack]);

  return (
    <div className="playlist__item">
      <div className="playlist__index">
        {!isPlaying && <span>{index + 1}</span>}
        <Button
          src={isPlaying ? <Pause /> : <PlayImg />}
          type="player"
          custom={`playlist__item__button ${
            isPlaying && 'playlist__item__button--active'
          }`}
          onClick={() => handlePlay()}
        />
      </div>
      <div className="playlist__info">
        <div className="playlist__img">
          <img src={data.track.album.images[2].url} alt="" />
        </div>
        <div className="playlist__title">
          <span className="item__title">{data.track.name}</span>
          <span className="item__artist">
            {data.track.artists.map((e, index) => {
              return (
                <>
                  <Link key={index} to={'/artist/' + e.id}>
                    {e.name}
                  </Link>
                  {index < data.track.artists.length - 1 && ', '}
                </>
              );
            })}
          </span>
        </div>
      </div>
      <div className="playlist__album">
        <span>
          <Link to={'/album/' + data.track.album.id}>
            {data.track.album.name}
          </Link>
        </span>
      </div>
      <div className="playlist__added">
        <span>{useDateFormater(data.added_at)}</span>
      </div>
      <div className="playlist__time">
        <span>{useMinutesString(data.track.duration_ms)}</span>
      </div>
    </div>
  );
};
