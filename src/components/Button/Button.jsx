import React from 'react';
import './Button.styles.css'

export const Button = (props) => {


    return (
        <>
            {props.type === 'nav' && (
                <a href="#" className={`button--nav ${props.custom ? props.custom : ''}`}>
                    <div className='button__icon'>{props.src}</div>
                    {props.children && (<span className='button__title'>{props.children}</span>)}
                </a>
            )}

            {props.type === 'icon' && (

                <a href="#" className={`button--icon ${props.custom ? props.custom : ''}`}>
                    <div className='button__icon'>{props.src}</div>
                </a>
            )}

        </>
    )


};