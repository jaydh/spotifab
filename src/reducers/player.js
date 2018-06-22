import { List } from 'immutable';
import shuffle from 'immutable-shuffle';

export default (
  state = {
    queue: List(),
    currentTrack: null,
    volume: 0.5,
    spotifyPlayer: null,
    ytPlayer: null,
    repeat: true,
    position: 0
  },
  action
) => {
  switch (action.type) {
    case 'TOGGLE_REPEAT':
      return {
        ...state,
        repeat: !state.repeat
      };
    case 'UPDATE_VOLUME':
      return {
        ...state,
        volume: action.volume
      };
    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: List(),
        position: 0,
        currentTrack: null
      };
    case 'ADD_SONG_TO_FRONT_QUEUE':
      return {
        ...state,
        queue: state.queue.insert(0, action.song)
      };

    case 'PREV_SONG': {
      const nextPos =
        state.position - 1 < 0 && state.repeat
          ? state.queue.size - 1
          : state.position - 1;
      return {
        ...state,
        position: nextPos,
        currentTrack: state.queue.get(nextPos).track
      };
    }
    case 'NEXT_SONG': {
      const nextPos = state.position + 1;
      return {
        ...state,
        position: nextPos,
        currentTrack: state.queue.get(nextPos).track
      };
    }
    case 'ADD_SONG_TO_QUEUE':
      return {
        ...state,
        queue: state.queue.push(action.song)
      };
    case 'SHUFFLE_QUEUE':
      const shuffled = shuffle(state.queue);
      return { ...state, queue: shuffled };
    case 'UPDATE_CURRENT_TRACK':
      return {
        ...state,
        position: state.queue.findIndex(t => t.id === action.track.id),
        currentTrack: action.track
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token
      };
    case 'UPDATE_SPOTIFY_PLAYER_STATE':
      return { ...state, spotifyPlayer: action.state };
    case 'UPDATE_YOUTUBE_PLAYER_STATE':
      return { ...state, ytPlayer: action.state };

    case 'UPDATE_POSITION':
      return { ...state, position: action.position };

    default:
      return state;
  }
};
