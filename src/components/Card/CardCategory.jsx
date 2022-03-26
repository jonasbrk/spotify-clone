import React, { useContext, useEffect, useRef, useState } from 'react';
import './Card.styles.css';
import { Button } from '..';
import { PlayImg, Pause } from '../../assets/svg';
import { SpotifyApi, generateRandomColor } from '../../utils/';
import { Link, useNavigate } from 'react-router-dom';
import {
  DeviceContext,
  PlayerContext,
  TokenContext,
  TrackContext,
} from '../../utils/context';

export const CardCategory = (props) => {
  const { itemInfo } = props;
  const navigate = useNavigate(null);
  return (
    <div
      style={{ backgroundColor: generateRandomColor() }}
      className="card__type--category"
      onClick={() => {
        navigate('/genre/' + itemInfo.id);
      }}
    >
      <div className="card__img">
        <img src={itemInfo.icons[0].url} alt="" />
      </div>

      <h3 className="card__title">{itemInfo.name}</h3>
    </div>
  );
};
