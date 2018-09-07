import { List } from 'immutable';
import shuffle from 'immutable-shuffle';
export default (
  state = {
    queue: List(),
    repeat: true,
    position: 0,
    controller: null
  },
  action
) => {
  switch (action.type) {
    case 'PLAY':
      return {
        controller: action.controller,
        ...state
      };
    case 'TOGGLE_REPEAT':
      return {
        ...state,
        repeat: !state.repeat
      };
    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: List(),
        position: 0
      };
    case 'ADD_SONG_TO_FRONT_QUEUE':
      return {
        ...state,
        queue: state.queue.insert(0, action.song)
      };

    case 'REMOVE_SONG_FROM_QUEUE':
      return {
        ...state,
        queue: state.queue.delete(action.position)
      };

    case 'MAKE_NEW_QUEUE': {
      return { ...state, queue: action.songs, position: 0 };
    }
    case 'PREV_SONG': {
      const nextPos =
        state.position - 1 < 0 && state.repeat
          ? state.queue.size - 1
          : state.position - 1;
      return {
        ...state,
        position: nextPos
      };
    }
    case 'NEXT_SONG': {
      const nextPos =
        state.position + 1 >= state.queue.size && state.repeat
          ? 0
          : state.position + 1;
      return {
        ...state,
        position: nextPos
      };
    }
    case 'ADD_SONG_TO_QUEUE':
      return {
        ...state,
        queue: state.queue.push(action.song)
      };
    case 'SHUFFLE_QUEUE':
      const shuffled = state.queue.isEmpty()
        ? state.queue
        : shuffle(state.queue.delete(state.position)).insert(
            0,
            state.queue.find(
              t => t.track.id === state.queue.get(state.position).track.id
            )
          );
      return { ...state, queue: shuffled, position: 0 };
    case 'INSERT_SONG_IN_QUEUE':
      return {
        ...state,
        queue: state.queue.insert(action.position, action.track)
      };
    case 'UPDATE_POSITION':
      return {
        ...state,
        position: action.position
      };
    default:
      return state;
  }
};
