import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { PcImg, PcDeviceImg, DevicePlayingImg } from '../../assets/svg';
import './DeviceButton.styles.css';
import { CreateContext } from '../../pages/home/Home';
import { useComponentVisible } from '../../utils/useOutsideClick';
import axios from 'axios';
import { DeviceContext, TokenContext } from '../../utils/context';

export const DeviceButton = () => {
  const { ref1, ref2, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const { accessToken } = useContext(TokenContext);
  const { currentDeviceId, setCurrentDeviceId } = useContext(DeviceContext);

  const [devicesList, setDevicesList] = useState([]);
  const [showDevices, setShowDevices] = useState(false);
  const [deviceID, setDeviceID] = useState('');

  useEffect(() => {
    console.log(isComponentVisible);
    if (!isComponentVisible) {
      axios
        .get('https://api.spotify.com/v1/me/player/devices', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + accessToken,
          },
        })
        .then((e) => {
          setDevicesList(e.data.devices);
          if (e.data.devices.length <= 1) setShowDevices(false);
          else setShowDevices(true);
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
  }, [isComponentVisible]);

  useEffect(() => {
    console.log(deviceID);
  }, [deviceID]);

  return (
    <div className="devices__wrapper" ref={ref1}>
      <Button
        type="player"
        custom="devices__button"
        src={<PcImg />}
        onClick={() => {
          setIsComponentVisible(!isComponentVisible);
        }}
      />
      <div
        className={`devices__list ${
          isComponentVisible && 'devices__list--visible'
        }`}
      >
        <div className="devices__header">
          <h3>
            Conectar a um
            <br /> dispositivo
          </h3>
        </div>
        <div className="devices__img">
          <img
            src="https://open.scdn.co/cdn/images/connect_header@1x.8f827808.png"
            alt=""
          />
        </div>
        <div
          className={`${showDevices ? 'devices__main--list' : 'devices__main'}`}
        >
          {showDevices ? (
            <ul>
              {devicesList.map((e, index) => {
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setCurrentDeviceId(e.id);
                      }}
                      className={`device__item ${
                        e.id == currentDeviceId && 'device__item--active'
                      }`}
                    >
                      <div className="device__icon">
                        <PcDeviceImg />
                      </div>
                      <div className="device__info">
                        <span className="device__name">{e.name}</span>
                        <div className="device__type__wrapper">
                          <DevicePlayingImg />
                          <span className="device__type">{e.type}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              <p>Toque e controle o Spotify em qualquer dispositivo.</p>
              <p>
                Abra o Spotify em outro dispositivo e, num passe de mágica, ele
                vai aparecer aqui.
              </p>
              <a className="devices__main__button" href="#">
                SAIBA MAIS
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
