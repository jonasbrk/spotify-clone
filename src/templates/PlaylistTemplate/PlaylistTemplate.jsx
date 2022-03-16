import React, { useContext, useEffect, useState } from 'react';
import './PlaylistTemplate.styles.css';
import { Button, PlaylistItem, Loading } from '../../components';
import { Pause, PlayImg } from '../../assets/svg';
import axios from 'axios';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';
import { useParams } from 'react-router-dom';
import { SpotifyApi } from '../../utils';

export const PlaylistTemplate = () => {
  const { accessToken } = useContext(TokenContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistData, setPlaylistData] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentTrack } = useContext(TrackContext);
  const { currentDeviceId } = useContext(DeviceContext);
  const { player } = useContext(PlayerContext);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((e) => {
        setPlaylistData(e.data);
        setLoading(false);
        console.log(e);
      });
  }, [id]);

  const handlePlay = () => {
    if (!currentTrack.init_load) {
      if (currentTrack.context.uri != playlistData.uri) {
        SpotifyApi(
          'PUT',
          accessToken,
          'https://api.spotify.com/v1/me/player/play?device_id=' +
            currentDeviceId,

          {
            context_uri: playlistData.uri,
            offset: { position: 0 },
            position_ms: 0,
          },
        );
      } else {
        player.togglePlay().then(() => {
          console.log('Toggled playback!');
        });
      }
    }
  };

  useEffect(() => {
    if (!currentTrack.init_load) {
      if (currentTrack.context.uri == playlistData.uri && currentTrack.play) {
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
          <div className="header__template__container">
            <div className="header__cover__container">
              <img src={playlistData.images[0].url} />
            </div>
            <div className="header__info__container">
              <div className="template__type">
                <span>{playlistData.type}</span>
              </div>
              <div className="template__name">
                <h2>{playlistData.name}</h2>
              </div>
              <div className="template__info">
                <span>{playlistData.owner.display_name}</span>
              </div>
            </div>
          </div>
          <div className="main__template__container">
            <div className="main__template__header">
              <Button
                onClick={() => {
                  handlePlay();
                }}
                type="player"
                custom={`play--buton--album ${
                  isPlaying && 'play--buton--card--album'
                }`}
                src={isPlaying ? <Pause /> : <PlayImg />}
              />
            </div>
            <div className="main__template__list">
              <div className="template__list__header">
                <div>
                  <span>#</span>
                </div>
                <div>
                  <span>TÍTULO</span>
                </div>
                <div>
                  <span>ÁLBUM</span>
                </div>
                <div>
                  <span>ADICIONADO EM</span>
                </div>
                <div>
                  <span>🕘</span>
                </div>
              </div>
              {playlistData.tracks.items.map((e, index) => {
                return (
                  <PlaylistItem
                    playlist={playlistData}
                    key={index}
                    index={index}
                    data={e}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
