import React, { useContext } from 'react';
import './SideMenu.styles.css';
import { Button } from '../index';
import { isCoverOpen, TrackContext } from '../../utils/context';
import {
  LogoImg,
  HomeImg,
  SearchImg,
  LibraryImg,
  PlusImg,
  LikeImg,
  ArrowUpImg,
} from '../../assets/svg/index';

export const SideMenu = (props) => {
  // const { isPlaying, currentTrack } = useContext(CreateContext);
  const { coverOpen, setCoverOpen } = useContext(isCoverOpen);
  const { currentTrack } = useContext(TrackContext);
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
