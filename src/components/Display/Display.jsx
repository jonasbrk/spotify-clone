import React, { useEffect, useRef, useState } from 'react';
import { useContainerDimensions } from '..';
import './Display.styles.css';
import { MockedData } from '../../mokedData';
import { DisplayRow, Button } from '..';
import { PlayImg } from '../../assets/svg';

export const Display = () => {
  const displayRef = useRef(null);

  const { width } = useContainerDimensions(displayRef);
  const [itensLength, setItensLength] = useState((width / 244).toFixed(0));
  useEffect(() => {
    setItensLength((width / 204).toFixed(0));
    console.log(itensLength);
  }, [width]);
  return (
    <div className="display" ref={displayRef}>
      {MockedData.map((e) => {
        return (
          <DisplayRow
            title={e.title}
            id={e.index}
            key={e.index}
            itens={e.itens}
            itensLength={itensLength}
          />
        );
      })}
    </div>
  );
};
