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
import { requestWithToken } from '../utils';

import './styles/Template.styles.css';

export const ArtistTemplate = () => {
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
        axios.get(`https://api.spotify.com/v1/artists/${id}`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }),

        axios.get(
          `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id}`,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        ),

        axios.get(
          `https://api.spotify.com/v1/artists/${id}/top-tracks?market=BR`,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        ),
      ]).then((e) => {
        const [artist, isLiked, tracksData] = e;
        const { tracks } = tracksData.data;
        const { name, id, images, type, followers, description, uri } =
          artist.data;
        setData({
          uri: uri,
          name: name,
          id: id,
          type: type,
          tracks: tracks,
          isLiked: isLiked.data[0],
          color: generateRandomColor(),
          description: description,
          cover: images,
          followers: followers,
        });

        setLoading(false);
      });
  }, [id, accessToken]);

  const handlePlay = async () => {
    if (
      !currentTrack ||
      currentTrack.context.uri ||
      !data.tracks
        .map((e) => {
          return e.uri;
        })
        .includes(currentTrack.uri)
    ) {
      try {
        await requestWithToken(
          'PUT',
          'https://api.spotify.com/v1/me/player/play?device_id=' +
            currentDeviceId,
          accessToken,
          {
            uris: data.tracks.map((e) => {
              return e.uri;
            }),
            offset: { position: 0 },
            position_ms: 0,
          },
        );
      } catch (error) {
        console.log(error);
      } finally {
        console.log('Playing artist ' + data.name);
      }
    } else {
      player.togglePlay().then(() => {
        console.log('Toggled playback!');
      });
    }
  };

  useEffect(() => {
    if (currentTrack && data) {
      console.log(data.tracks.map((e) => e.uri));
      if (
        !currentTrack.context.uri &&
        data.tracks.map((e) => e.uri).includes(currentTrack.uri) &&
        currentTrack.play
      ) {
        setIsPlaying(true);
      } else setIsPlaying(false);
    }
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
              <TrackList var1="ÁLBUM" data={data} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
