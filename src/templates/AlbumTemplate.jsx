import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Loading, PageBanner, TrackList } from '../components';

import { generateRandomColor, requestWithToken } from '../utils';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../utils/context';

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
    setData('');
    setLoading(true);
    if (accessToken)
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
      ])
        .then((e) => {
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
        })
        .catch((error) => console.log(error));
  }, [id, accessToken]);

  const handlePlay = async () => {
    if (!currentTrack || currentTrack.context.uri != data.uri) {
      try {
        await requestWithToken(
          'PUT',
          'https://api.spotify.com/v1/me/player/play?device_id=' +
            currentDeviceId,
          accessToken,
          {
            context_uri: data.uri,
            offset: { position: 0 },
            position_ms: 0,
          },
        );
      } catch (error) {
        console.log(error);
      } finally {
        console.log('Playing album ' + data.name);
      }
    } else {
      player.togglePlay().then(() => {
        console.log('Toggled playback!');
      });
    }
  };

  useEffect(() => {
    console.log(
      currentTrack && currentTrack.context.uri == data.uri && currentTrack.play,
      'album playlist',
    );
    if (
      currentTrack &&
      currentTrack.context.uri == data.uri &&
      currentTrack.play
    ) {
      setIsPlaying(true);
    } else setIsPlaying(false);
  }, [currentTrack, data]);

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
