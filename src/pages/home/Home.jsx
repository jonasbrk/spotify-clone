import React, { useState, createContext } from 'react';
import './Home.styles.css';
import { MockedData } from '../../mokedData';
import { Header, Display, SideMenu, Player } from '../../components/index';
export const CreateContext = createContext();
const Home = () => {
  const [coverOpen, setCoverOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(MockedData[1].itens[1]);

  return (
    <CreateContext.Provider
      value={{ coverOpen, setCoverOpen, isPlaying, setIsPlaying }}
    >
      <main>
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
