import React, { useEffect } from 'react';
import { PlaylistItem } from '../';
import { ClockImg } from '../../assets/svg';
import './TrackList.styles.css';

export const TrackList = ({ data, var1, var2 }) => {
  return (
    <div className="main__template__list">
      <div className="template__list__header">
        <div className="index">
          <span>#</span>
        </div>
        <div className="first">
          <span>TÍTULO</span>
        </div>
        {var1 && (
          <div className="var1">
            <span>{var1}</span>
          </div>
        )}
        {var2 && (
          <div className="var2">
            <span>{var2}</span>
          </div>
        )}
        <div className="last">
          <span>
            <ClockImg />
          </span>
        </div>
      </div>
      {data.tracks.map((e, index) => {
        console.log(e);
        return (
          <PlaylistItem
            playlist={data}
            var1={var1}
            var2={var2}
            key={index}
            index={index}
            data={e}
          />
        );
      })}
    </div>
  );
};
