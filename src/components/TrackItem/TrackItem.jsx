import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './TrackItem.styles.css';
import {
  useMinutesString,
  useDateFormater,
  requestWithToken,
} from '../../utils';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import {
  DeviceContext,
  Menssage,
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
  const { setMenssage } = useContext(Menssage);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddToPlaylist = async () => {
    const request = await requestWithToken(
      'PUT',
      `https://api.spotify.com/v1/playlists/${trackList.id}/tracks?uris=` +
        data.uri,
      accessToken,
    );
    try {
      request();
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  };

  const handlePlay = async () => {
    const options = {
      context_uri:
        trackList.type == 'search' || trackList.type == 'search--playlist'
          ? data.album.uri
          : trackList.uri,
      offset: {
        position:
          trackList.type == 'search' || trackList.type == 'search--playlist'
            ? data.track_number - 1
            : index,
      },
      position_ms: 0,
    };
    const options_artist = {
      uris: trackList.tracks.map((e) => {
        return e.uri;
      }),
      offset: { position: index },
      position_ms: 0,
    };

    if (!currentTrack || currentTrack.uri != data.uri) {
      try {
        const response = await requestWithToken(
          'PUT',
          'https://api.spotify.com/v1/me/player/play?device_id=' +
            currentDeviceId,
          accessToken,
          props.collection || trackList.type == 'artist'
            ? options_artist
            : options,
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
    if (currentTrack && currentTrack.uri == data.uri && currentTrack.play) {
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
        {trackList.type == 'search--playlist' ? (
          <button
            className="add__button"
            onClick={() => {
              handleAddToPlaylist();
            }}
          >
            {' '}
            adicionar{' '}
          </button>
        ) : (
          <>
            <span>{useMinutesString(data.duration_ms)}</span>
            <OptionsDropdown data={data} />
          </>
        )}
      </div>
    </div>
  );
};
