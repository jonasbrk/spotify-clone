import React from 'react';

export const useMinutesString = (ms, cursive) => {
  let formatedTime = '';

  if (ms <= 3600000) {
    let min = Math.floor(ms / 60000);
    let seg = String(((ms % 60000) / 1000).toFixed(0)).padStart(2, 0);

    formatedTime = `${min}${cursive ? 'min ' : ':'}${seg}${
      cursive ? 'seg' : ''
    }`;
  } else {
    let hr = Math.floor(ms / 3600000);
    let min = Math.floor((ms % 3600000) / 60000).toFixed(0);

    formatedTime = `${hr}${cursive ? 'h ' : ''}${min}${cursive ? 'min' : ''}`;
  }

  return formatedTime;
};
