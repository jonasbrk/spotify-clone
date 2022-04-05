import React, { useContext, useEffect, useState } from 'react';
import { Menssage } from '../../utils/context';
import './FlashMenssage.styles.css';
export const FlashMenssage = () => {
  const [opacity, setOpacity] = useState(false);
  const { menssage, setMenssage } = useContext(Menssage);

  useEffect(() => {
    if (menssage) {
      setOpacity(true);
      const Delay = setTimeout(() => {
        setOpacity(false);
        setMenssage('');
      }, 3000);
      return () => clearTimeout(Delay);
    }
  }, [menssage]);

  return (
    <>
      {menssage && (
        <div
          style={{ opacity: opacity ? 1 : 0 }}
          className={`menssage ${
            menssage.type && 'menssage--' + menssage.type
          }`}
        >
          <span>{menssage && menssage.text}</span>
        </div>
      )}
    </>
  );
};
