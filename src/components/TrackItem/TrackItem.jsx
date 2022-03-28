import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './TrackItem.styles.css';
import { useMinutesString, useDateFormater } from '../../utils';
import { Button } from '..';
import { PlayImg, Pause, LikeImg } from '../../assets/svg';
import { SpotifyApi } from '../../utils';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

import { OptionsDropdown } from '../';

export const TrackItem = (props) => {
  const { data, index, trackList, var1, var2, type } = props;
  const { currentTrack } = useContext(TrackContext);
  const { accessToken } = useContext(TokenContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (currentTrack.uri != data.uri || currentTrack.init_load) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,
        {
          context_uri: type == 'search' ? data.album.uri : trackList.uri,
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
    if (currentTrack.uri == data.uri && currentTrack.play) {
      setIsPlaying(true);
    } else setIsPlaying(false);
  }, [currentTrack]);

  return (
    <div
      className="track__item"
      onDoubleClick={() => {
        handlePlay();
      }}
    >
      <div className="track__index">
        {!isPlaying && <span>{index + 1}</span>}
        <Button
          src={isPlaying ? <Pause /> : <PlayImg />}
          type="player"
          custom={`track__item__button ${
            isPlaying && 'track__item__button--active'
          }`}
          onClick={() => handlePlay()}
        />
      </div>
      <div className="track__info">
        {!(trackList.type == 'album') && (
          <div className="track__img">
            <img src={data.album.images[2].url} alt="" />
          </div>
        )}

        <div className="track__title">
          <span className={`item__title ${isPlaying && 'track__item--active'}`}>
            {data.name}
          </span>

          <span className="item__artist">
            {data.artists.map((e, index) => {
              return (
                <>
                  <Link key={index} to={'/artist/' + e.id}>
                    {e.name}
                  </Link>
                  {index < data.artists.length - 1 && ', '}
                </>
              );
            })}
          </span>
        </div>
      </div>
      {var1 && (
        <div className="track__album">
          <span>
            <Link to={'/album/' + data.album.id}>{data.album.name}</Link>
          </span>
        </div>
      )}
      {var2 && (
        <div className="track__added">
          <span>{useDateFormater(data.added_at)}</span>
        </div>
      )}
      <div className="track__time">
        <span>{useMinutesString(data.duration_ms)}</span>
        <OptionsDropdown data={data} />
      </div>
    </div>
  );
};
