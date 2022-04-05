import React, { useContext } from 'react';
import './SongInfo.styles.css';
import { Button } from '..';
import { ArrowUpImg } from '../../assets/svg/index';
import { isCoverOpen, TrackContext } from '../../utils/context';
import { Link } from 'react-router-dom';

export const SongInfo = () => {
  const { setCoverOpen } = useContext(isCoverOpen);
  const { currentTrack } = useContext(TrackContext);

  const convertUri = (uri) => uri.substr(8, uri.length).replace(':', '/');

  return (
    <>
      <div className="song__player__cover">
        <img
          className="song__player__img"
          src={currentTrack.album.images[1].url}
          alt=""
        />
        <Button
          onClick={() => setCoverOpen((coverOpen) => !coverOpen)}
          type="icon"
          custom="expand__song__player__cover"
          src={<ArrowUpImg />}
        />
      </div>
      <div className="song__player__info">
        <span className="song__player__title">
          <Link
            to={
              currentTrack.context
                ? convertUri(currentTrack.context.uri)
                : `/album/${currentTrack.album.id}`
            }
          >
            {currentTrack.name}
          </Link>
        </span>
        <span className="song__player__autor">
          {currentTrack.artists.map((e, index) => (
            <>
              <Link key={index} to={convertUri(e.uri)}>
                {e.name}
              </Link>
              {index < currentTrack.artists.length - 1 && ', '}
            </>
          ))}
        </span>
      </div>
    </>
  );
};
