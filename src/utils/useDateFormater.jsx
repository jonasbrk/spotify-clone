import React from 'react';

export const useDateFormater = (timeStamp) => {
  const splitedInfo = String(timeStamp).split('T');
  const dateInfo = splitedInfo[0].split('-');
  const dateSplited = new Date(dateInfo.join()).toDateString().split(' ');
  const [weekDay, month, day, year] = dateSplited;
  const dateFormated = `${day} de ${month.toLowerCase()}. de ${year}`;

  return dateFormated;
};
