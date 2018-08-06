export default (
  state = {
    filter: '',
    sort: 'added-asc'
  },
  action
) => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    case 'SET_SORT':
      return { ...state, sort: action.sort };
    default:
      return state;
  }
};
