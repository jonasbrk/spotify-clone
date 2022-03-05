import React, { useContext } from 'react';
import './SideMenu.styles.css';
import { Button } from '../index';
import { CreateContext } from '../../pages/home/Home';
import {
  LogoImg,
  HomeImg,
  SearchImg,
  LibraryImg,
  PlusImg,
  LikeImg,
  ArrowUpImg,
} from '../../assets/svg/index';

export const SideMenu = () => {
  const { coverOpen, setCoverOpen, isPlaying } = useContext(CreateContext);
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
          <img src={isPlaying.album.images[1].url} alt="" />
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
