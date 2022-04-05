import React, { useContext, useEffect, useRef, useState } from 'react';
import { OptionsImg } from '../../assets/svg';
import { DropdownMenu } from '../';
import './OptionsDropdown.styles.css';
import { Menssage, TokenContext } from '../../utils/context';
import axios from 'axios';
import { requestWithToken } from '../../utils';

export const OptionsDropdown = ({
  data,
  openModal,
  editable,
  isLiked,
  setIsLiked,
}) => {
  const { accessToken } = useContext(TokenContext);
  const { setMenssage } = useContext(Menssage);

  const handleAddQueue = async () => {
    try {
      const response = await requestWithToken(
        'POST',
        `https://api.spotify.com/v1/me/player/queue?uri=${data.uri}`,
        accessToken,
      );
      if (response.status === 204) {
        setMenssage({
          text: 'Na fila',
        });
      } else {
        setMenssage({
          text: 'Opps, something went wrong!',
          type: 'important',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    if (data.type != 'track') {
      let url = {
        artist: `https://api.spotify.com/v1/me/following?type=artist&ids=${data.id}`,
        playlist: `https://api.spotify.com/v1/playlists/${data.id}/followers`,
        album: `https://api.spotify.com/v1/me/albums?id=${data.id}`,
      };

      try {
        const response = await requestWithToken(
          isLiked ? 'DELETE' : 'PUT',
          url[data.type],
          accessToken,
        );

        if (response.status === 204) {
          setIsLiked(!isLiked);
          setMenssage({
            text: !isLiked
              ? 'Adicionado à sua biblioteca'
              : 'Removido de sua biblioteca',
          });
        } else {
          setMenssage({
            text: 'Opps, something went wrong!',
            type: 'important',
          });
        }
      } catch (error) {
        console.log(error);
      }
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
