import React, { useEffect, useRef, useState } from 'react';
import { useComponentVisible } from '../index';
import './UserMenu.styles.css';
import { ArrowDownMenuImg, ArrowUpMenuImg } from '../../assets/svg/index';

export const UserMenu = () => {
  const { ref1, ref2, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  return (
    <>
      <button
        ref={ref1}
        className="user__menu__btn"
        onClick={() => {
          setIsComponentVisible((isComponentVisible) => !isComponentVisible);
          console.log(isComponentVisible);
        }}
      >
        <div className="user__picture">
          <img
            aria-hidden="false"
            draggable="false"
            loading="eager"
            src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=722636637892467&amp;height=300&amp;width=300&amp;ext=1648215160&amp;hash=AeSC1UhcZtC_AN20f0M"
            alt="João Pedro Tomé"
            className="mMx2LUixlnN_Fu45JpFB zG1A4D_KmJ5_9XpcNKJ7"
          />
        </div>
        <div className="user__name">
          <span>João Pedro Tome Caires Lopes</span>
        </div>
        <div className="user__icon">
          {isComponentVisible ? <ArrowUpMenuImg /> : <ArrowDownMenuImg />}
        </div>
      </button>
      <div
        ref={ref2}
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
    </>
  );
};
