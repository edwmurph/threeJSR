const threejsr = (previousState = {}, action) => {
  if (action.type !== 'THREEJSR') {
    return previousState;
  }

  const namespace = Object.keys(action.threejsr)[0];

  return {
    ...previousState,
    [namespace]: {
      ...previousState[namespace],
      timestamp: null, // old timestamps shouldnt remain in state
      ...action.threejsr[namespace],
    },
  };
};

export default threejsr;
