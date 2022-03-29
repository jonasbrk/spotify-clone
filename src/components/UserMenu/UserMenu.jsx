import React, { useContext, useEffect, useRef, useState } from 'react';
import { useComponentVisible } from '../../utils/useOutsideClick';
import './UserMenu.styles.css';
import {
  ArrowDownMenuImg,
  ArrowUpMenuImg,
  UseDefaultImg,
} from '../../assets/svg/index';
import { TokenContext, UserContext } from '../../utils/context';
import axios from 'axios';

export const UserMenu = () => {
  const { accessToken } = useContext(TokenContext);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { ref1, ref2, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  useEffect(() => {
    axios
      .get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then((e) => {
        setCurrentUser(e.data);
      });
  }, [accessToken]);

  return (
    <>
      {accessToken && (
        <div ref={ref1} className="user__menu">
          <button
            className="user__menu__btn"
            onClick={() => {
              setIsComponentVisible(!isComponentVisible);
            }}
          >
            <div className="user__picture">
              {currentUser.images.length ? (
                <img
                  aria-hidden="false"
                  draggable="false"
                  loading="eager"
                  src={currentUser.images[0]}
                  alt={currentUser.display_name}
                />
              ) : (
                <div className="user--default">
                  <UseDefaultImg />
                </div>
              )}
            </div>
            <div className="user__name">
              <span>{currentUser.display_name}</span>
            </div>
            <div className="user__icon">
              {isComponentVisible ? <ArrowUpMenuImg /> : <ArrowDownMenuImg />}
            </div>
          </button>
          <div
            className={`user__menu__options ${
              isComponentVisible ? 'user--open' : ''
            }`}
          >
            <ul className="menu__list">
              <li>
                <a href="#">
                  <span>Conta</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>Perfil</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>Premium</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>Suporte</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>Baixar</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span>Sair</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
