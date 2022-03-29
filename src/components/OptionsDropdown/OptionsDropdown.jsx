import React, { useContext, useEffect, useRef, useState } from 'react';
import { ArrowUpMenuImg, OptionsImg } from '../../assets/svg';
import { DropdownMenu } from '../';
import './OptionsDropdown.styles.css';
import { DeviceContext, TokenContext } from '../../utils/context';
import axios from 'axios';

export const OptionsDropdown = ({
  data,
  openModal,
  editable,
  isLiked,
  setIsLiked,
}) => {
  const { accessToken } = useContext(TokenContext);

  const handleAddQueue = () => {
    axios(`https://api.spotify.com/v1/me/player/queue?uri=${data.uri}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      method: 'POST',
    });
  };

  const handleFollow = () => {
    if (data.type != 'track') {
      let url = {
        artist: `https://api.spotify.com/v1/me/following?type=artist&ids=${data.id}`,
        playlist: `https://api.spotify.com/v1/playlists/${data.id}/followers`,
        album: `https://api.spotify.com/v1/me/albums?id=${data.id}`,
      };

      axios(url[data.type], {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        method: isLiked ? 'DELETE' : 'PUT',
      }).then(() => {
        setIsLiked(!isLiked);
      });
    }
  };

  return (
    <DropdownMenu
      src={<OptionsImg />}
      position={data.type == 'track' ? 'left' : 'right'}
    >
      <ul className="buttons__wrapper">
        {data.type != 'track' && (
          <li>
            <button
              onClick={() => (editable ? openModal(true) : handleFollow())}
            >
              {editable ? (
                <span>Editar os detalhes</span>
              ) : (
                <span>
                  {isLiked
                    ? 'Remover da sua biblioteca'
                    : 'Adicionar a biblioteca'}
                </span>
              )}
            </button>
          </li>
        )}
        {data.type == 'track' && (
          <>
            <li>
              <button onClick={() => handleAddQueue()}>
                <span>Adicionar a fila</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </DropdownMenu>
  );
};
