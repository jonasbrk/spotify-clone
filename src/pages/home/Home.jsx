import React, { useState, createContext, useRef, useEffect, lazy } from 'react';
import './Home.styles.css';
import { MockedData } from '../../mokedData';
import { Header, Display, SideMenu, Player } from '../../components/index';
import { handleRedirect } from '../../services/client';
import { axios } from 'axios';

export const CreateContext = createContext();
const Home = (props) => {
  const { recentPlaylist, loadData, SpotifyApi } = props;
  const [coverOpen, setCoverOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(
    loadData.recentPlayedData.items[0].track,
  );
  useEffect(() => {
    console.log(loadData);
  }, [loadData]);

  return (
    <CreateContext.Provider
      value={{
        loadData,
        SpotifyApi,
        coverOpen,
        setCoverOpen,
        isPlaying,
        setIsPlaying,
      }}
    >
      <main ref={props.homeRef} className="home">
        <div className="main__section">
          <SideMenu />
          <div className="main__wrapper">
            <Header />
            <Display />
          </div>
        </div>
        <Player />
      </main>
    </CreateContext.Provider>
  );
};
export default Home;
