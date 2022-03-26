import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { DisplayFull, PageHeader, Loading, CardLiked } from '../../components';
import { TokenContext } from '../../utils/context';
import './styles/CollectionPlaylists.styles.css';

export const CollectionPlaylists = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState({});
  const [userLiked, setUserLiked] = useState('');

  useEffect(() => {
    Promise.all([
      axios
        .get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          console.log(e.data);
          setUserPlaylists(e.data);
        }),

      axios
        .get('https://api.spotify.com/v1/me/tracks', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          const { items } = e.data;
          setUserLiked({
            name: 'Liked Songs',
            type: 'playlist',
            tracks: items.map((e) => {
              return e.track;
            }),
          });
        }),
    ]).then(() => {
      setLoading(false);
    });
  }, [accessToken]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page__wrapper">
          <PageHeader bgColor="rgb(18, 18, 18)" disabled={true}>
            <div className="collection__nav">
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'collection__nav--active' : ''
                }
                to="/collection/playlists"
              >
                <span>Playlists</span>{' '}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'collection__nav--active' : ''
                }
                to="/collection/artists"
              >
                <span>Artists</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'collection__nav--active' : ''
                }
                to="/collection/albums"
              >
                <span>Albums</span>
              </NavLink>
            </div>
          </PageHeader>
          <div className="collection__playlists">
            <DisplayFull
              title="Playlists"
              type="playlist"
              data={userPlaylists.items.map((e) => {
                return { ...e, description: `De ${e.owner.display_name}` };
              })}
            >
              <CardLiked itemInfo={userLiked} />
            </DisplayFull>
          </div>
        </div>
      )}
    </>
  );
};
