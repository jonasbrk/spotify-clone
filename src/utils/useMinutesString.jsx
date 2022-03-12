import React from 'react';

export const useMinutesString = (ms) => {
  return `${Math.floor(ms / 60000)}:${String(
    ((ms % 60000) / 1000).toFixed(0),
  ).padStart(2, 0)}`;
};
