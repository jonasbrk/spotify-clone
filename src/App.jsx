import React, { useEffect, useState } from 'react';
import qs from 'qs';
import axios from 'axios';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { client_id, client_secret, uri, scope } from './credentials';

import Home from './pages/home/Home';
import { SearchPage } from './pages/search/SearchPage';
import {
  PlaylistTemplate,
  AlbumTemplate,
  ArtistTemplate,
  GenreTemplate,
} from './templates/index';
import {
  CollectionTracks,
  CollectionPlaylists,
  CollectionAlbums,
  CollectionArtists,
} from './pages/library';

import { Layout, Loading } from './components';

import { TokenContext } from './utils/context';
import { getCookie, setCookie } from './utils/useCookie';

import './App.css';

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate(null);
  const location = useLocation();

  const useLogin = () => {
    window.location.href =
      'https://accounts.spotify.com/authorize?' +
      qs.stringify({
        client_id: client_id,
        response_type: 'code',
        redirect_uri: uri,
        scope: scope,
        show_dialog: true,
      });
  };

  useEffect(() => {
    if (!getCookie('refresh_token')) {
      const querryString = window.location.search;
      const urlParams = new URLSearchParams(querryString);
      if (!urlParams.get('code')) {
        navigate('/login');
      } else {
        window.history.pushState('', '', uri);
        const options = qs.stringify({
          grant_type: 'authorization_code',
          code: urlParams.get('code'),
          redirect_uri: uri,
          client_id: client_id,
          client_secret: client_secret,
        });
        axios
          .post('https://accounts.spotify.com/api/token', options, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
            },
          })
          .then(({ data }) => {
            setAccessToken(data.access_token);
            setCookie('access_token', data.access_token, data.expires_in);
            setCookie('refresh_token', data.refresh_token);
          })
          .catch((e) => {
            console.log(e.response);
          });
      }
    } else {
      if (location.pathname == '/login') navigate('/');
      const options = qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: getCookie('refresh_token'),
      });

      axios
        .post('https://accounts.spotify.com/api/token', options, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
          },
        })
        .then(({ data }) => {
          setAccessToken(data.access_token);
          setCookie('access_token', data.access_token, data.expires_in);
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
  }, []);

  return (
    <>
      {!accessToken && getCookie('refresh_token') ? (
        <div className="loading__overlay">
          <Loading />
        </div>
      ) : (
        <TokenContext.Provider value={{ accessToken }}>
          <Layout login={useLogin}>
            <Route exact path="/" element={<Home />} />
            <Route path="/playlist/:id" element={<PlaylistTemplate />} />
            <Route path="/album/:id" element={<AlbumTemplate />} />
            <Route path="/artist/:id" element={<ArtistTemplate />} />
            <Route path="/genre/:id" element={<GenreTemplate />} />
            <Route path="/collection/tracks" element={<CollectionTracks />} />
            <Route
              path="/collection/playlists"
              element={<CollectionPlaylists />}
            />
            <Route
              path="/collection/"
              element={<Navigate to="/collection/playlists" replace />}
            />
            <Route path="/collection/albums" element={<CollectionAlbums />} />
            <Route path="/collection/artists" element={<CollectionArtists />} />
            <Route path="/search/" element={<SearchPage />} />
          </Layout>
        </TokenContext.Provider>
      )}
    </>
  );
};

export default App;
