import React, { useState, createContext, useRef, useEffect, lazy } from 'react';
import './Layout.styles.css';
import { Header, SideMenu, Player } from '../index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  isCoverOpen,
  TrackContext,
  AlbumContext,
  PlayerContext,
  DeviceContext,
  UserContext,
} from '../../utils/context';

export const Layout = (props) => {
  const { children } = props;
  const [coverOpen, setCoverOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');
  const [albumInfo, setAlbumInfo] = useState('');
  const [player, setPlayer] = useState('');
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    console.log(currentTrack);
  }, [currentTrack]);

  return (
    <DeviceContext.Provider value={{ currentDeviceId, setCurrentDeviceId }}>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <PlayerContext.Provider value={{ player, setPlayer }}>
          <AlbumContext.Provider value={{ albumInfo, setAlbumInfo }}>
            <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
              <isCoverOpen.Provider value={{ coverOpen, setCoverOpen }}>
                <main className="layout">
                  <div className="main__section">
                    <SideMenu />
                    <div className="main__wrapper">
                      <Header />
                      <main className="display">
                        <Routes>{children}</Routes>
                      </main>
                    </div>
                  </div>
                  <Player />
                </main>
              </isCoverOpen.Provider>
            </TrackContext.Provider>
          </AlbumContext.Provider>
        </PlayerContext.Provider>
      </UserContext.Provider>
    </DeviceContext.Provider>
  );
};
