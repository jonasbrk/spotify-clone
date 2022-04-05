import React, { useEffect, useState } from 'react';

import { Card } from '../';
import { Loading } from '../';

import { useContainerDimensions } from '../../utils';

import './CardRowSection.styles.css';

export const CardRowSection = (props) => {
  const { title, data } = props;
  const [itensLength, setItensLength] = useState('');
  const [newArray, setNewArray] = useState(
    data.filter((e, index) => index < itensLength - 1),
  );
  const { dimensions, ref } = useContainerDimensions();

  useEffect(() => {
    setItensLength(Math.floor(dimensions.width / 204) + 1);
  }, [dimensions]);

  useEffect(() => {
    if (itensLength < 2) return data.filter((e) => e == 0);
    if (data) {
      setNewArray(data.filter((e, index) => index < itensLength - 1));
    }
  }, [itensLength, data]);

  return (
    <div ref={ref} className="main__row">
      <div className="main__row--header">
        <h2>{title}</h2>
      </div>
      <div className="main__row--main">
        {newArray ? (
          newArray.map((e, index) => <Card data={e} key={index} />)
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};
