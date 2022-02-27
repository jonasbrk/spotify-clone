import React, { useEffect, useState } from 'react';
import './RangeSlider.styles.css';

export const RangeSlider = (props) => {
  const { inputMin, inputMax, handle, progress, inputValue } = props;
  const [progressValue, setProgressValue] = useState(progress);
  const [marginLeft, setMarginLeft] = useState(0);

  const handleRangeProgress = (e) => {
    setProgressValue(e.target.value);
  };

  useEffect(() => {
    handle(progressValue);
  }, [progressValue]);

  useEffect(() => {
    const centerThumb = (12 / 100) * progress * -1;
    setMarginLeft(centerThumb);
  }, [progress, inputValue]);
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
            transform: `translate(-${100 - progress}%)`,
          }}
        ></div>
      </div>
      <div
        className="progressNode"
        style={{ left: `${progress}%`, marginLeft: `${marginLeft}px` }}
      ></div>
    </div>
  );
};
