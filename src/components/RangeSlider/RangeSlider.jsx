import React, { useEffect, useState } from 'react';
import './RangeSlider.styles.css';

export const RangeSlider = (props) => {
  const { inputMin, inputMax, handle } = props;
  const [progressValue, setProgressValue] = useState('');
  const [progressPercent, setProgressPercent] = useState('');
  const [marginLeft, setMarginLeft] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleRangeProgress = (e) => {
    setProgressValue(e.target.value);
  };

  useEffect(() => {
    const percentage = ((progressValue * 100) / inputMax).toFixed(4);
    setProgressPercent(percentage);
    setInputValue(progressValue);
    const centerThumb = (12 / 100) * percentage * -1;
    setMarginLeft(centerThumb);
    handle(progressValue);
  }, [progressValue]);
  return (
    <div className="rangeSlider">
      <input
        type="range"
        min={inputMin}
        max={inputMax}
        value={inputValue}
        onChange={(e) => handleRangeProgress(e)}
      />
      <div className="progressBar">
        <div
          className="progressFill"
          style={{
            transform: `translate(-${100 - progressPercent}%)`,
          }}
        ></div>
      </div>
      <div
        className="progressNode"
        style={{ left: `${progressPercent}%`, marginLeft: `${marginLeft}px` }}
      ></div>
    </div>
  );
};
