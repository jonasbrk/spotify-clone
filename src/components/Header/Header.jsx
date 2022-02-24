import React from 'react';
import './Header.styles.css'
import { Button, UserMenu } from '../index'
import { ArrowLeftImg, ArrowRigthImg } from '../../assets/svg/index'


export const Header = () => {
    return (
        <header>
            <div className='header__wrapper'>
                <Button type='icon' src={<ArrowLeftImg />} effect='grow' />
                <Button type='icon' src={<ArrowRigthImg />} />
            </div>
            <div className='header__wrapper'>
                <UserMenu />
            </div>
        </header>
    );
};