export default function threejsr (previousState, action) {
  switch (action.type) {
  case 'TIMESTAMP':
    return { timestamp: action.timestamp }
  case 'THREEJSR':
    return Object.assign({}, action.e)
  default:
    return {}
  }
}
