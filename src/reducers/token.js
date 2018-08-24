import { addMinutes, isBefore, parse } from 'date-fns';

export default (
  state = {
    token: undefined,
    time: undefined,
    refetch: false,
    valid: false
  },
  action
) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
        time: action.time,
        refetch: false,
        valid: isBefore(new Date(), addMinutes(parse(action.time), 30))
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
