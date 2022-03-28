import React, { useContext, useEffect, useState } from 'react';
import './PlaylistTemplate.styles.css';
import { Loading, PageBanner, TrackList, AddSongs } from '../../components';
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

export const PlaylistTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { currentUser } = useContext(UserContext);
  const { player } = useContext(PlayerContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [pageData, setPageData] = useState('');

  const { id } = useParams();

  useEffect(() => {
    setData('');
    setPageData('');
    setLoading(true);

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
      const { name, images, type, owner, uri, tracks, description } = data.data;

      console.log(e);
      setData({
        uri: uri,
        name: name,
        id: id,
        type: type,
        tracks: tracks.items.map((e) => {
          return e.track;
        }),
        isLiked: isLiked.data[0],
      });

      setPageData({
        color: generateRandomColor(),
        title: type,
        description: description,
        name: name,
        cover: images.lenght ? images : undefined,
        type: type,
        owner: owner.display_name,
        editable: owner.id == currentUser.id,
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
          <PageBanner
            id={data.id}
            pageData={pageData}
            play={[handlePlay, isPlaying]}
            editable={pageData.editable}
            data={data}
          />
          <div className="playlist__template">
            <div className="main__template__container">
              <TrackList var1="ÁLBUM" data={data} />
              {pageData.editable && <AddSongs data={data} id={data.id} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
