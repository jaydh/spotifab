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
export const removeSongFromQueue = position => {
  return {
    type: 'REMOVE_SONG_FROM_QUEUE',
    position
  };
};

export const insertSongInQueue = (track, position) => {
  return {
    type: 'INSERT_SONG_IN_QUEUE',
    position,
    track
  };
};

export const updatePosition = position => {
  return async (dispatch, getState) => {
    dispatch({ type: 'UPDATE_POSITION', position });
    const next = getState().queue.queue.get(position).track;
    const token = getState().token.token;
    const spotifyPaused =
      getState().player.spotifyPlayer && getState().player.spotifyPlayer.paused;
    const apiPlay = ({
      spotify_uri,
      playerInstance: {
        _options: { id }
      }
    }) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: spotify_uri }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    };

    if (next.uri) {
      window.ytPlayer.pauseVideo();
      //If switching from youtube to spotify, use last played track
      apiPlay({
        playerInstance: window.player,
        spotify_uri: [next.uri]
      });
    } else {
      window.ytPlayer.loadVideoById(next.id);
      window.player.pause();
    }
    dispatch({ type: 'PLAY' });
  };
};
