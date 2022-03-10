import React, { useEffect, useRef, useState, useContext } from 'react';
import { useContainerDimensions } from '..';
import './Display.styles.css';
import { MockedData } from '../../mokedData';
import { DisplayRow } from '../index';
import { PlayImg } from '../../assets/svg';
import { CreateContext } from '../../pages/home/Home';

export const Display = (props) => {
  const { recentPlaylist } = props;
  const { loadData } = useContext(CreateContext);
  const displayRef = useRef(null);
  // const [itensLength, setItensLength] = useState(4);

  // const handleLength = (e) => {
  //   if (Math.floor(displayRef.current.offsetWidth / 204) != itensLength) {
  //     setItensLength(Math.floor(displayRef.current.offsetWidth / 204));
  //   }
  // };

  // useEffect(() => {
  //   console.log(Window);
  // }, [Window]);

  // useEffect(() => {
  //   window.addEventListener('resize', (e) => handleLength(e));
  //   return () => {
  //     window.removeEventListener('resize', (e) => handleLength(e));
  //   };
  // });

  return (
    <>
      <div className="display" ref={displayRef}>
        <DisplayRow
          title="Tocado recentemente"
          data={loadData.recentPlayedData.items.map((e) => {
            return e.track;
          })}
        />
        <DisplayRow
          title="Feito para você"
          displayRef={displayRef}
          data={loadData.recommendationsData.tracks}
        />
        <DisplayRow
          title="As mais ouvidas por você"
          displayRef={displayRef}
          data={loadData.topUserItemsTracks.items}
        />
      </div>
    </>
  );
};
