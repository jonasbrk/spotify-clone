import React, { useContext, useEffect, useState } from 'react';
import './ArtistTemplate.styles.css';
import { Loading, PageBanner, TrackList } from '../../components';
import { generateRandomColor } from '../../utils';
import axios from 'axios';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { useParams } from 'react-router-dom';
import { SpotifyApi } from '../../utils';

export const ArtistTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);
  const [data, setData] = useState('');
  const [pageData, setPageData] = useState('');

  const { id } = useParams();

  useEffect(() => {
    Promise.all([
      axios
        .get(`https://api.spotify.com/v1/artists/${id}`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          const { name, images, type, followers } = e.data;
          setPageData({
            color: generateRandomColor(),
            title: type,
            description: 'oi',
            name: name,
            cover: images,
            type: type,
            owner: [
              { name: `${followers.total} Subscriptions`, type: 'artist' },
            ],
          });
        }),

      axios
        .get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=BR`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          const { name, type, tracks, id, uri } = e.data;
          setData({
            uri: uri,
            name: name,
            id: id,
            type: type,
            tracks: tracks,
          });
        }),
    ]).then((e) => {
      console.log(e);
      setLoading(false);
    });
  }, [id]);

  const handlePlay = () => {
    if (
      (!currentTrack.context.uri &&
        !data.tracks
          .map((e) => {
            return e.uri;
          })
          .includes(currentTrack.uri)) ||
      currentTrack.init_load
    ) {
      SpotifyApi(
        'PUT',
        accessToken,
        'https://api.spotify.com/v1/me/player/play?device_id=' +
          currentDeviceId,

        {
          uris: data.tracks.map((e) => {
            return e.uri;
          }),
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
      if (
        !currentTrack.context.uri &&
        data.tracks
          .map((e) => {
            return e.uri;
          })
          .includes(currentTrack.uri) &&
        currentTrack.play
      ) {
        setIsPlaying(true);
      } else setIsPlaying(false);
    }
  }, [currentTrack]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="playlist__template">
          <PageBanner pageData={pageData} play={[handlePlay, isPlaying]} />
          <div className="main__template__container">
            <TrackList var1="ÁLBUM" data={data} />
          </div>
        </div>
      )}
    </>
  );
};
