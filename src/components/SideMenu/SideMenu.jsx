import React, { useContext, useEffect, useState } from 'react';
import './SideMenu.styles.css';
import { Button } from '../index';
import {
  isCoverOpen,
  PlaylistContext,
  TokenContext,
  TrackContext,
  UserContext,
} from '../../utils/context';
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
  const { currentUser } = useContext(UserContext);
  const { userPlaylists, setUserPlaylists } = useContext(PlaylistContext);

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

  const handleAddPlaylist = () => {
    axios(`https://api.spotify.com/v1/users/${currentUser.id}/playlists`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      method: 'POST',
      data: {
        name: `Minha Playlist nº ${userPlaylists.length + 1}`,
      },
    }).then((e) => {
      setUserPlaylists([e.data, ...userPlaylists]);
    });
  };

  return (
    <div className="side__nav">
      <div className="logo__container">
        <LogoImg />
      </div>

      <div className="menu__wrapper">
        <Button to="/" src={<HomeImg />} type="nav">
          Início
        </Button>
        <Button to="/search" src={<SearchImg />} type="nav">
          Buscar
        </Button>
        <Button to="/collection" src={<LibraryImg />} type="nav">
          Sua Biblioteca
        </Button>
      </div>
      <div className="menu__wrapper divider--top ">
        <Button
          onClick={() => {
            handleAddPlaylist();
          }}
          custom={'create__playlist'}
          src={<PlusImg />}
          type="nav"
        >
          Criar playlist
        </Button>
        <Button
          to="/collection/tracks"
          custom={'liked__songs'}
          src={<LikeImg />}
          type="nav"
        >
          Músicas Curtidas
        </Button>
      </div>
      <div className="divider--bottom--line"></div>
      <div className="userPlaylist__nav">
        {userPlaylists &&
          userPlaylists.map((e, index) => {
            return (
              <Button to={`/playlist/${e.id}`} key={index} type="nav">
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
