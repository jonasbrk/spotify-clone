import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Home from './pages/home/Home';
import { Login } from './pages/login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { client_id, uri, scope } from './credentials';
import { onLoadRequestsData, onClickRequest } from './requests';
const App = () => {
  const homeRef = useRef(null);
  const [isLoading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loadData, setLoadData] = useState('');

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
    onLoadRequestsData(
      setLoading,
      setAccessToken,
      setRefreshToken,
      setLoadData,
    );
  }, [homeRef]);

  const SpotifyApi = (Type, URL, Body) => {
    let response = '';
    axios(URL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + accessToken,
      },
      data: Body,
      method: Type,
    })
      .then((e) => {
        response = e;
      })
      .catch((e) => {
        console.log(e.response);
      });
    return response;
  };

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            isLoading ? (
              <h1 ref={homeRef}>loading</h1>
            ) : (
              <Home
                accessToken={accessToken}
                SpotifyApi={SpotifyApi}
                loadData={loadData}
              />
            )
          }
        />
        <Route path="/login" element={<Login useLogin={useLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;
