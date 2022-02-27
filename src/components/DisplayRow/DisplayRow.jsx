import React, { useEffect, useState } from 'react';
import './DisplayRow.styles.css';
import { Card } from '..';

export const DisplayRow = (props) => {
  const { title, description, itens, id, itensLength } = props;

  const [newArray, setNewArray] = useState([]);

  useEffect(() => {
    if (itensLength < 2) return itens.filter((e) => e == 0);
    setNewArray(itens.filter((e, index) => index < itensLength - 1));
  }, [itensLength]);
  return (
    <div className="main__row">
      <div className="main__row--header">
        <h2>{title}</h2>
        {itens.length < itensLength ? '' : <a href="#">VER TUDO</a>}
      </div>
      <div className="main__row--main">
        {newArray.map((e) => {
          return <Card itemInfo={e} key={e.index} />;
        })}
      </div>
    </div>
  );
};
