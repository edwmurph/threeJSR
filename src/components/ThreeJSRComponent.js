import React, { useRef, useEffect, useState } from 'react';

const ThreeJSRComponent = (props) => {
  const ref = useRef();

  const [timestamp, setTimestamp] = useState();

  const [threejs] = useState(() => props.ThreeJSR.init(ref, setTimestamp));

  useEffect(() => {
    threejs.afterMount();
    return () => threejs.cleanup();
  }, []);

  // animation loop
  useEffect(() => {
    const renderLoopData = { ...(props.renderLoopData || {}), timestamp };
    threejs.renderNextFrame(renderLoopData);
  }, [props.renderLoopData, timestamp]);

  return (
    <canvas ref={ref} style={{ height: '100%', width: '100%', ...props.style }}></canvas>
  );
};

export default ThreeJSRComponent;
