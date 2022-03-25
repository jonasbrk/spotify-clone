import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Home from './pages/home/Home';
import { SearchPage } from './pages/search/SearchPage';
import {
  PlaylistTemplate,
  AlbumTemplate,
  ArtistTemplate,
} from './templates/index';
import {
  CollectionTracks,
  CollectionPlaylists,
  CollectionAlbums,
  CollectionArtists,
} from './pages/library';
import { Login } from './pages/login/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { client_id, client_secret, uri, scope } from './credentials';
import { Layout } from './components';
import { TokenContext } from './utils/context';
const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

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
    const querryString = window.location.search;
    if (querryString.length > 0) {
      const urlParams = new URLSearchParams(querryString);
      const token = urlParams.get('code');
      window.history.pushState('', '', uri);

      const data = qs.stringify({
        grant_type: 'authorization_code',
        code: urlParams.get('code'),
        redirect_uri: uri,
        client_id: client_id,
        client_secret: client_secret,
      });

      axios
        .post('https://accounts.spotify.com/api/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
          },
        })
        .then((request) => {
          setAccessToken(request.data.access_token);
          setRefreshToken(request.data.refresh_token);
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
  }, []);

  return (
    <>
      <TokenContext.Provider value={{ accessToken }}>
        <Layout>
          <Route exact path="/" element={<Home />} />
          <Route path="/playlist/:id" element={<PlaylistTemplate />} />
          <Route path="/album/:id" element={<AlbumTemplate />} />
          <Route path="/artist/:id" element={<ArtistTemplate />} />
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
          <Route path="/search" element={<SearchPage />} />
          {/* <Route path="/genre/:id" element={GenreTemplate} /> */}
          <Route path="/login" element={<Login useLogin={useLogin} />} />
        </Layout>

        {/* <Routes>
  
          </Routes> */}
      </TokenContext.Provider>
    </>
  );
};

export default App;
