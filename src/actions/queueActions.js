import { List } from 'immutable';
import { play } from './songActions';

export const toggleRepeat = () => {
  return {
    type: 'TOGGLE_REPEAT'
  };
};

export const updateCurrentTrack = track => {
  return {
    type: 'UPDATE_CURRENT_TRACK',
    track
  };
};
export const addSongToQueue = song => {
  return {
    type: 'ADD_SONG_TO_QUEUE',
    song
  };
};
export const clearSongQueue = () => {
  return {
    type: 'CLEAR_QUEUE'
  };
};

export const shuffleQueue = () => {
  return {
    type: 'SHUFFLE_QUEUE'
  };
};
export const addSongToFront = song => {
  return {
    type: 'ADD_SONG_TO_FRONT_QUEUE',
    song
  };
};

export const seekForward = id => {
  return async (dispatch, getState) => {
    window.player
      .pause()
      .then(() =>
        dispatch({
          type: 'UPDATE_ACTIVE_QUEUE',
          id
        })
      )
      .then(() => dispatch(play()));
  };
};
