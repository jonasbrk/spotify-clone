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
  UserContext,
} from '../../utils/context';
import { useParams } from 'react-router-dom';
import { SpotifyApi } from '../../utils';

export const ArtistTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useContext(TrackContext);
  const { currentUser } = useContext(UserContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);
  const [data, setData] = useState('');
  const [pageData, setPageData] = useState('');

  const { id } = useParams();

  useEffect(() => {
    setData('');
    setPageData('');
    setLoading(true);
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
      console.log(e);
      const [artist, isLiked, tracksData] = e;
      const { tracks, id, uri } = tracksData.data;
      const { name, images, type, followers, description } = artist.data;
      setData({
        uri: uri,
        name: name,
        id: id,
        type: type,
        tracks: tracks,
        isLiked: isLiked.data[0],
      });

      setPageData({
        color: generateRandomColor(),
        title: type,
        description: description,
        name: name,
        cover: images,
        type: type,
        owner: `${followers.total} Subscriptions`,
      });

      setLoading(false);
    });
  }, [id]);

  const handlePlay = () => {
    if (
      !data.tracks
        .map((e) => {
          return e.uri;
        })
        .includes(currentTrack.uri) ||
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
        <div className="page__wrapper">
          <PageBanner
            id={data.id}
            pageData={pageData}
            play={[handlePlay, isPlaying]}
            data={data}
          />
          <div className="playlist__template">
            <div className="main__template__container">
              <TrackList var1="ÁLBUM" data={data} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
