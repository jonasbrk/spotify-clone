import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { Loading, PageBanner, TrackList } from '../../components';

import {
  DeviceContext,
  Menssage,
  PlayerContext,
  TokenContext,
  TrackContext,
  UserContext,
} from '../../utils/context';
import { requestWithToken, useResponseFormater } from '../../utils';

import './styles/Collection.styles.css';

export const CollectionTracks = () => {
  const { accessToken } = useContext(TokenContext);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);
  const { currentUser } = useContext(UserContext);
  const { setMenssage } = useContext(Menssage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');

  useEffect(() => {
    if (accessToken)
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
              return useResponseFormater(e.track);
            }),
            owner: currentUser.display_name,
            color: 'rgb(80, 56, 160)',
            cover: [
              {
                url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png',
              },
            ],
          });
          setLoading(false);
        });
  }, [accessToken]);

  const handlePlay = async () => {
    if (
      !data.tracks
        .map((e) => {
          return e.uri;
        })
        .includes(currentTrack.uri) ||
      currentTrack.init_load
    ) {
      try {
        const response = await requestWithToken(
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
          <PageBanner play={[handlePlay, isPlaying]} colection data={data} />
          <div className="playlist__template">
            <div className="main__template__container">
              <TrackList var1="ÁLBUM" data={data} collection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
