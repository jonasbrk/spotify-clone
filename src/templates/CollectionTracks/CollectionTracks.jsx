import React, { useContext, useEffect, useState } from 'react';
import './CollectionTracks.styles.css';
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

export const CollectionTracks = () => {
  const { accessToken } = useContext(TokenContext);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);
  const { currentUser } = useContext(UserContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [pageData, setPageData] = useState('');

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/tracks', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((e) => {
        const { items } = e.data;
        setData({
          name: 'Liked Songs',
          type: 'playlist',
          tracks: items.map((e) => {
            return e.track;
          }),
        });

        setPageData({
          color: 'rgb(80, 56, 160)',
          title: 'playlist',
          description: 'oi',
          name: 'Liked Songs',
          cover: [
            {
              url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png',
            },
          ],
          type: 'playlist',
          owner: currentUser.display_name,
        });
        setLoading(false);
      });
  }, [accessToken]);

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
