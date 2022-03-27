import React, { useEffect, useRef, useState } from 'react';
import './PageBanner.styles.css';
import { Pause, PlayImg } from '../../assets/svg';
import { PageHeader } from './PageHeader';
import { Button, Cover, EditInfo } from '../';
import { Link } from 'react-router-dom';
export const PageBanner = ({
  pageData,
  play,
  disabled,
  bgColor,
  editable,
  id,
}) => {
  const { color, title, name, cover, type, owner, total_tracks } = pageData;
  const [handlePlay, isPlaying] = play;
  const headerBgRef = useRef(null);
  const headerGradientRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const opacityHandler = () => {
    const grandienInfo = headerGradientRef.current.getBoundingClientRect();
    const opacitiyPercent = (
      1 -
      ((grandienInfo.bottom - 64) * 100) / ((grandienInfo.height - 64) * 100)
    ).toFixed(2);
    console.log(opacitiyPercent);

    if (opacitiyPercent >= 1) setOpacity(1);
    if (opacitiyPercent > 0 && opacitiyPercent < 1) setOpacity(opacitiyPercent);
    if (opacitiyPercent <= 0) setOpacity(0);
  };

  useEffect(() => {
    console.log(headerBgRef);
    headerBgRef.current.parentNode.addEventListener('scroll', () =>
      opacityHandler(),
    );
    return () => {
      headerBgRef.current.parentNode.removeEventListener('scroll', () =>
        opacityHandler(),
      );
    };
  }, [headerBgRef]);
  return (
    <>
      <div
        ref={headerBgRef}
        className="pageBanner__header"
        style={{
          backgroundColor: color,
          opacity: opacity,
        }}
      >
        <div className="pageBanner__header__sticky__gradient"></div>
      </div>

      <div className="pageBanner">
        <EditInfo
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={pageData}
          id={id}
        />
        <div
          className="pageBanner__color"
          style={
            type == 'artist'
              ? { backgroundImage: `url(${cover[0].url})` }
              : { backgroundColor: color }
          }
        ></div>
        <div ref={headerGradientRef} className="pageBanner__gradient"></div>
        {type != 'artist' && (
          <Cover
            src={cover[0].url}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            editable={editable}
          />
        )}
        <div className="info__container">
          <div className="page__type">
            <span>{title}</span>
          </div>
          <div
            className={`page__name ${editable && 'page__name--editable'}`}
            onClick={() => {
              editable && setIsOpen(true);
            }}
          >
            <h2>{name}</h2>
          </div>
          <div className="page__info">
            <span className="page__owner">
              {type == 'artist' || type == 'playlist' ? (
                owner
              ) : (
                <>
                  {owner.map((e, index) => (
                    <>
                      <Link key={index} to={'/artist/' + e.id}>
                        {e.name}
                      </Link>
                    </>
                  ))}
                  <span>
                    {`${total_tracks} ${
                      total_tracks > 1 ? 'músicas' : 'música'
                    }`}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="pageBanner__buttons">
        <div
          className="pageBanner__buttons__gradient"
          style={{ backgroundColor: color }}
        ></div>
        <Button
          onClick={() => {
            handlePlay();
          }}
          type="player"
          custom={`play--buton--pageBanner ${
            isPlaying && 'play--buton--pageBanner--active'
          }`}
          src={isPlaying ? <Pause /> : <PlayImg />}
        />
      </div>
    </>
  );
};
