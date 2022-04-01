import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { LikeImg, Pause, PlayImg } from '../../assets/svg';
import { Button, Cover, EditInfo, OptionsDropdown } from '../';

import { TokenContext } from '../../utils/context';
import { useMinutesString } from '../../utils';

import './PageBanner.styles.css';

export const PageBanner = ({ play, data, colection }) => {
  const headerBgRef = useRef(null);
  const headerGradientRef = useRef(null);
  const { accessToken } = useContext(TokenContext);
  const [handlePlay, isPlaying] = play;
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(data && data.isLiked);
  const [opacity, setOpacity] = useState(0);

  const opacityHandler = () => {
    const grandienInfo = headerGradientRef.current.getBoundingClientRect();
    const opacitiyPercent = (
      1 -
      ((grandienInfo.bottom - 64) * 100) / ((grandienInfo.height - 64) * 100)
    ).toFixed(2);

    if (opacitiyPercent >= 1) setOpacity(1);
    if (opacitiyPercent > 0 && opacitiyPercent < 1) setOpacity(opacitiyPercent);
    if (opacitiyPercent <= 0) setOpacity(0);
  };

  useEffect(() => {
    headerBgRef.current.parentNode.addEventListener('scroll', () =>
      opacityHandler(),
    );
    return () => {
      headerBgRef.current.parentNode.removeEventListener('scroll', () =>
        opacityHandler(),
      );
    };
  }, [headerBgRef]);

  const handleFollow = () => {
    let url = {
      artist: `https://api.spotify.com/v1/me/following?type=artist&ids=${data.id}`,
      playlist: `https://api.spotify.com/v1/playlists/${data.id}/followers`,
      album: `https://api.spotify.com/v1/me/albums?ids=${data.id}`,
    };

    axios(url[data.type], {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      method: isLiked ? 'DELETE' : 'PUT',
    }).then(() => {
      setIsLiked(!isLiked);
    });
  };

  return (
    <>
      <div
        ref={headerBgRef}
        className="pageBanner__header"
        style={{
          backgroundColor: data.color,
          opacity: opacity,
        }}
      >
        <div className="pageBanner__header__sticky__gradient"></div>
      </div>

      <div className="pageBanner">
        <EditInfo isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
        <div
          className="pageBanner__color"
          style={
            data.type == 'artist'
              ? { backgroundImage: `url(${data.cover[0].url})` }
              : { backgroundColor: data.color }
          }
        ></div>
        <div ref={headerGradientRef} className="pageBanner__gradient"></div>
        {data.type != 'artist' && (
          <Cover
            src={data.cover == undefined ? data.cover : data.cover[0].url}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            editable={data.editable}
          />
        )}
        <div className="info__container">
          <div className="page__type">
            <span>{data.type}</span>
          </div>
          <div
            className={`page__name ${data.editable && 'page__name--editable'}`}
            onClick={() => {
              data.editable && setIsOpen(true);
            }}
          >
            <h2>{data.name}</h2>
          </div>
          <div className="page__info">
            <span className="page__owner">
              {data.type == 'artist' &&
                data.followers.total.toLocaleString('pt-BR', {
                  style: 'decimal',
                }) + ' seguidores'}
              {data.type == 'playlist' && !data.editable && !colection && (
                <>
                  <span className="span--after--bold">{data.owner}</span>
                  <span className="span--after">{`${data.followers.total.toLocaleString(
                    'pt-BR',
                    { style: 'decimal' },
                  )} curtidas`}</span>
                  <span>
                    {` ${data.tracks.length} ${
                      data.tracks.length > 1 ? 'músicas' : 'música'
                    },`}
                    <span>
                      {' ' + data.tracks.length != 0 &&
                        useMinutesString(
                          data.tracks
                            .map((e) => e.duration_ms)
                            .reduce((p, c) => p + c),
                          true,
                        )}
                    </span>
                  </span>
                </>
              )}
              {data.type == 'playlist' && data.editable && (
                <>
                  <span className="span--after--bold">{data.owner}</span>
                  <span>
                    {` ${data.tracks.length} ${
                      data.tracks.length > 1 ? 'músicas' : 'música'
                    }${data.tracks.length >= 1 ? ', ' : ''}`}
                    <span>
                      {' ' + data.tracks.length != 0 &&
                        useMinutesString(
                          data.tracks
                            .map((e) => e.duration_ms)
                            .reduce((p, c) => p + c),
                          true,
                        )}
                    </span>
                  </span>
                </>
              )}
              {data.type == 'album' &&
                data.artists.map((e, index) => (
                  <>
                    <Link key={index} to={'/artist/' + e.id}>
                      {e.name}
                    </Link>
                  </>
                ))}
            </span>
          </div>
        </div>
      </div>
      <div className="pageBanner__buttons">
        <div
          className="pageBanner__buttons__gradient"
          style={{ backgroundColor: data.color }}
        ></div>
        {data.tracks.length && (
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
        )}
        {!data.editable && !colection && (
          <Button
            type="player"
            src={<LikeImg />}
            custom={`button__pageBanner ${isLiked && 'liked'}`}
            onClick={() => {
              handleFollow();
            }}
          />
        )}
        {data && !colection && (
          <OptionsDropdown
            data={data}
            editable={data.editable}
            openModal={setIsOpen}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            custom={'button__pageBanner'}
          />
        )}
      </div>
    </>
  );
};
