import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Loading, PageBanner, TrackList } from '../components';

import { generateRandomColor } from '../utils';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../utils/context';
import { SpotifyApi } from '../utils';

import './styles/Template.styles.css';

export const AlbumTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');

  const { id } = useParams();

  useEffect(() => {
    Promise.all([
      axios.get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }),
      axios.get(`https://api.spotify.com/v1/me/albums/contains?ids=${id}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }),
    ]).then((e) => {
      const [data, isLiked] = e;
      const {
        name,
        description,
        images,
        type,
        artists,
        total_tracks,
        tracks,
        id,
        uri,
      } = data.data;
      setData({
        uri: uri,
        name: name,
        id: id,
        type: type,
        tracks: tracks.items,
        isLiked: isLiked.data[0],
        color: generateRandomColor(),
        description: description,
        cover: images,
        artists: artists,
        total_tracks: total_tracks,
      });
      setLoading(false);
    });
  }, [id]);

  const handlePlay = () => {
    if (currentTrack.context.uri != data.uri || currentTrack.init_load) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          context_uri: data.uri,
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
    if (currentTrack.context) {
      if (currentTrack.context.uri == data.uri && currentTrack.play) {
        setIsPlaying(true);
      } else setIsPlaying(false);
    }
  }, [currentTrack]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page__wrapper">
          <PageBanner play={[handlePlay, isPlaying]} data={data} />
          <div className="page__template">
            <div className="main__template__container">
              <TrackList data={data} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
