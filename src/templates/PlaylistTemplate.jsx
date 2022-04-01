import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Loading, PageBanner, TrackList, AddSongs } from '../components';

import { generateRandomColor } from '../utils';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
  UserContext,
} from '../utils/context';
import { SpotifyApi } from '../utils';

import './styles/Template.styles.css';

export const PlaylistTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentUser } = useContext(UserContext);
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
        axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        }),
        axios.get(
          `https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${currentUser.id}`,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        ),
      ]).then((e) => {
        const [data, isLiked] = e;
        const {
          name,
          images,
          type,
          owner,
          uri,
          tracks,
          description,
          followers,
        } = data.data;

        setData({
          uri: uri,
          name: name,
          id: id,
          type: type,
          owner: owner.display_name,
          tracks: tracks.items.map((e) => {
            return e.track;
          }),
          description: description,
          followers: followers,
          isLiked: isLiked.data[0],
          editable: owner.id == currentUser.id,
          cover: images.length ? images : undefined,
          color: generateRandomColor(),
        });

        setLoading(false);
      });
  }, [id, accessToken]);

  const handlePlay = () => {
    if (currentTrack.context.uri != data.uri) {
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
              <TrackList var1="ÁLBUM" data={data} />
              {data.editable && <AddSongs data={data} id={data.id} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
