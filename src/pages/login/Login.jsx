import React from 'react';
import { Button } from '../../components';
import { LogoImg, LogoSmallImg } from '../../assets/svg';
import { useNavigate } from 'react-router-dom';
import { requestAuthorization } from '../../services/client';

import './Login.styles.css';

export const Login = (props) => {
  const navigate = useNavigate();

  return (
    <main className="login">
      <div className="login__wrapper">
        <div className="login__header">
          <LogoImg />
        </div>
        <div className="login__main">
          <p>
            A react application made only for practice and academic purpose,
            please get login on Spotify to see to whole application.
            <br />
            Don&apos;t worry no user data will be stored.
          </p>
          <Button src={<LogoSmallImg />} type="login" custom="login__button">
            Login on Spotify
          </Button>
          <button onClick={() => props.useLogin()}></button>
        </div>
      </div>
    </main>
  );
};
