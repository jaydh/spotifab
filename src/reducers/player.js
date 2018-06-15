import { List } from 'immutable';
import shuffle from 'immutable-shuffle';

export default (
  state = {
    queue: List(),
    activeQueue: List(),
    currentTrack: null,
    volume: 0.5,
    player: null
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_VOLUME':
      return {
        ...state,
        volume: action.volume
      };
    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: List(),
        activeQueue: List(),
        currentTrack: null
      };
    case 'ADD_SONG_TO_FRONT_QUEUE':
      return {
        ...state,
        queue: state.queue.insert(0, action.song),
        activeQueue: state.activeQueue.insert(0, action.song)
      };
    case 'ADD_SONG_TO_QUEUE':
      return {
        ...state,
        queue: state.queue.push(action.song),
        activeQueue: state.activeQueue.push(action.song)
      };
    case 'SHUFFLE_QUEUE':
      const shuffled = shuffle(state.queue);
      return { ...state, queue: shuffled, activeQueue: shuffled };
    case 'UPDATE_CURRENT_TRACK':
      return { ...state, currentTrack: action.track };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token
      };
    case 'UPDATE_PLAYER_STATE':
      return { ...state, player: action.state };
    case 'UPDATE_ACTIVE_QUEUE':
      const position = state.queue.findIndex(t => t.track.id === action.id);
      return { ...state, activeQueue: state.queue.slice(position) };

    default:
      return state;
  }
};
