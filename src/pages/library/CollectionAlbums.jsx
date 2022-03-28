import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { NoAlbumImg } from '../../assets/svg';
import { DisplayFull, PageHeader, Loading } from '../../components';
import { TokenContext } from '../../utils/context';
import './styles/CollectionPlaylists.styles.css';

export const CollectionAlbums = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [userAlbums, setUserAlbums] = useState({});

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/albums', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((e) => {
        setUserAlbums(e.data);
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
            {userAlbums.items.length ? (
              <DisplayFull
                title="Albums"
                type="albums"
                data={userAlbums.items.map((e) => e.album)}
              />
            ) : (
              <div className="no_info">
                <div className="no_info__img">
                  <NoAlbumImg />
                </div>
                <div className="no_info__description">
                  <h2>Siga o seu primeiro álbum</h2>
                  <span>Para salvar um álbum, clique no ícone de coração.</span>
                </div>
                <div className="no_info__button">
                  <Link to={'/search'}>PROCURAR ÁLBUNS</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
