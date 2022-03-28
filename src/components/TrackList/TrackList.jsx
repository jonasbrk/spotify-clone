import React, { useEffect } from 'react';
import { TrackItem } from '../';
import { ClockImg } from '../../assets/svg';
import './TrackList.styles.css';

export const TrackList = ({ data, var1, var2 }) => {
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="main__template__list">
      {!data.type == 'search' && (
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
      )}
      {data.type == 'search' ? (
        <>
          {data.tracks
            .filter((e, index) => index < 4)
            .map((e, index) => {
              console.log(e);
              return (
                <TrackItem
                  trackList={data}
                  key={index}
                  index={index}
                  data={e}
                  type={data.type}
                />
              );
            })}
        </>
      ) : (
        <>
          {data.tracks.map((e, index) => {
            // console.log(e);
            return (
              <TrackItem
                trackList={data}
                var1={var1}
                var2={var2}
                key={index}
                index={index}
                data={e}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
