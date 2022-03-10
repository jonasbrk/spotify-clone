import React, { useState, createContext, useRef, useEffect, lazy } from 'react';
import './Home.styles.css';
import { MockedData } from '../../mokedData';
import { Header, Display, SideMenu, Player } from '../../components/index';
import { handleRedirect } from '../../services/client';
import { axios } from 'axios';

export const CreateContext = createContext();
const Home = (props) => {
  const { recentPlaylist, loadData, SpotifyApi, accessToken } = props;
  const [coverOpen, setCoverOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(
    loadData.recentPlayedData.items[0].track,
  );

  const [playbackState, setPlaybackState] = useState({
    loading: false,
    play: false,
    shuffle: false,
    repeat: false,
    progress: 0,
    duration: 0,
    track_window: {
      current_track: '',
      previous_tracks: [''],
      next_tracks: [''],
    },
  });
  const [player, setPlayer] = useState(undefined);
  const [playerCurrentProgress, setPlayerCurrentProgress] = useState('');
  // const [is_paused, setPaused] = useState(false);
  // const [is_active, setActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(
    loadData.recentPlayedData.items[0].track,
  );

  const [currentDeviceId, setCurrentDeviceId] = useState('');
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
        accessToken,
        setCurrentDeviceId,
        currentDeviceId,
        setPlayer,
        player,
        setPlaybackState,
        playbackState,
        setCurrentTrack,
        currentTrack,
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
