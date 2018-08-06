export default (
  state = {
    token: undefined,
    time: undefined,
    refetch: false
  },
  action
) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
        time: action.time,
        refetch: false
      };
    case 'REFETCH_TOKEN':
      return {
        ...state,
        refetch: true
      };
    default:
      return state;
  }
};
