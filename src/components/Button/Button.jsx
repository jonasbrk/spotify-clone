import React from 'react';
import './Button.styles.css'

export const Button = (props) => {


    return (
        <>
            {props.type === 'nav' && (
                <a href="#" className={`button--nav ${props.custom ? props.custom : ''} ${props.efect ? props.efect : ''}`}>
                    <div className='button__icon'>{props.src}</div>
                    <span className='button__title'>{props.children}</span>
                </a>
            )}

            {props.type === 'icon' && (
                <a href="#" className={`button--icon ${props.custom ? props.custom : ''} ${props.efect ? props.efect : ''}`}>
                    <div className='button__icon'>{props.src}</div>
                    <span className='button__title'>{props.children}</span>
                </a>
            )}
        </>
    )


};