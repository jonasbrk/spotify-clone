import React, { useEffect, useRef, useState } from 'react';
import './UserMenu.styles.css';
import { ArrowDownMenuImg } from '../../assets/svg/index';

export const UserMenu = () => {
  const OptionsRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenMenu = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        OptionsRef.current &&
        !OptionsRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        console.log('oi');
      }
    };
    document.addEventListener('mousedown', handleOpenMenu);
    return () => {
      document.removeEventListener('mousedown', handleOpenMenu);
    };
  }, [menuRef, OptionsRef]);

  return (
    <>
      <button
        ref={menuRef}
        className="user__menu__btn"
        onClick={() => (!menuOpen ? setMenuOpen(true) : setMenuOpen(false))}
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
          <ArrowDownMenuImg />
        </div>
      </button>
      <div
        ref={OptionsRef}
        className={`user__menu__options ${menuOpen ? 'user--open' : ''}`}
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
