import React, { useRef, useLayoutEffect, useState } from 'react';

const ThreeJSRComponent = (props) => {
  const ref = useRef();

  const [timestamp, setTimestamp] = useState();

  const [threejs] = useState(() => new props.ThreeJSR(ref, setTimestamp));

  useLayoutEffect(() => {
    threejs.afterMount();
    return () => threejs.cleanup();
  }, []);

  // animation loop
  useLayoutEffect(() => {
    const renderLoopData = { ...(props.renderLoopData || {}), timestamp };
    threejs.renderNextFrame(renderLoopData);
  }, [props.renderLoopData, timestamp]);

  return (
    <canvas ref={ref} style={{ height: '100%', width: '100%', ...props.style }}></canvas>
  );
};

export default ThreeJSRComponent;
