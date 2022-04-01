import './App.css';
import React, { useEffect, useState } from 'react';
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
import { Login } from './pages/login/Login';
import { Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { client_id, client_secret, uri, scope } from './credentials';
import { Layout, Loading } from './components';
import { TokenContext } from './utils/context';
import { getCookie, setCookie } from './utils/useCookie';
const App = () => {
  const [accessToken, setAccessToken] = useState('');

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
    } else {
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
      {!accessToken ? (
        <div className="loading__overlay">
          <Loading />
        </div>
      ) : (
        <TokenContext.Provider value={{ accessToken }}>
          <Layout>
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
            <Route path="/login" element={<Login useLogin={useLogin} />} />
          </Layout>
        </TokenContext.Provider>
      )}
    </>
  );
};

export default App;
