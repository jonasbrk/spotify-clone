import React, { useContext, useEffect, useState } from 'react';
import './SideMenu.styles.css';
import { Button } from '../index';
import { isCoverOpen, TokenContext, TrackContext } from '../../utils/context';
import {
  LogoImg,
  HomeImg,
  SearchImg,
  LibraryImg,
  PlusImg,
  LikeImg,
  ArrowUpImg,
} from '../../assets/svg/index';
import axios from 'axios';

export const SideMenu = (props) => {
  const { coverOpen, setCoverOpen } = useContext(isCoverOpen);
  const { accessToken } = useContext(TokenContext);
  const { currentTrack } = useContext(TrackContext);
  const [userPlaylists, setUserPlaylists] = useState('');

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((e) => {
        setUserPlaylists(e.data.items);
      });
  }, [accessToken]);

  return (
    <div className="side__nav">
      <div className="logo__container">
        <LogoImg />
      </div>

      <div className="menu__wrapper">
        <Button src={<HomeImg />} type="nav">
          Início
        </Button>
        <Button src={<SearchImg />} type="nav">
          Buscar
        </Button>
        <Button src={<LibraryImg />} type="nav">
          Sua Biblioteca
        </Button>
      </div>
      <div className="menu__wrapper divider--top ">
        <Button custom={'create__playlist'} src={<PlusImg />} type="nav">
          Criar playlist
        </Button>
        <Button custom={'liked__songs'} src={<LikeImg />} type="nav">
          Músicas Curtidas
        </Button>
      </div>
      <div className="divider--bottom--line"></div>
      <div className="userPlaylist__nav">
        {userPlaylists &&
          userPlaylists.map((e, index) => {
            return (
              <Button key={index} type="nav">
                {e.name}
              </Button>
            );
          })}
      </div>
      <div className="cover__side">
        <div
          className={`cover__side--wrapper ${
            coverOpen && 'cover__side--wrapper--open'
          }`}
        >
          {currentTrack && (
            <img src={currentTrack.album.images[0].url} alt="" />
          )}
          <Button
            onClick={() => setCoverOpen((coverOpen) => !coverOpen)}
            type="icon"
            custom="expand__cover--side"
            src={<ArrowUpImg />}
          />
        </div>
      </div>
    </div>
  );
};
