import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { NoArtistImg } from '../../assets/svg';
import { DisplayFull, PageHeader, Loading } from '../../components';
import { TokenContext } from '../../utils/context';
import './styles/CollectionPlaylists.styles.css';

export const CollectionArtists = () => {
  const { accessToken } = useContext(TokenContext);
  const [loading, setLoading] = useState(true);
  const [userArtists, setUserArtists] = useState();

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/following?type=artist', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((e) => {
        setUserArtists(e.data);
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
            {/* <DisplayFull
              title="Artists"
              type="artists"
              data={userArtists.artists.items}
            /> */}

            {userArtists.artists.items.length > 0 ? (
              <DisplayFull
                title="Artists"
                type="artists"
                data={userArtists.artists.items}
              />
            ) : (
              <div className="no_info">
                <div className="no_info__img">
                  <NoArtistImg />
                </div>
                <div className="no_info__description">
                  <h2>Siga o seu primeiro artista</h2>
                  <span>
                    Para seguir artistas que você curte, é só clicar no botão
                    “Seguir”.
                  </span>
                </div>
                <div className="no_info__button">
                  <Link to={'/search'}>PROCURAR ARTISTAS</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
