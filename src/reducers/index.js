export default function threejsr (previousState, action) {
  switch (action.type) {
    case 'THREEJSR':
      return { ...action.threejsr }
    default:
      return {}
  }
}
