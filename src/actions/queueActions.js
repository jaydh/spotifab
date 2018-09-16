import { List } from 'immutable';

export const updatePlayer = state => {
 return
};

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

export const makeNewQueue = songs => {
  return {
    type: 'MAKE_NEW_QUEUE',
    songs
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
  return {
    type: 'UPDATE_POSITION',
    position
  };
};

const apiPlay = (
  token,
  {
    spotify_uri,
    playerInstance: {
      _options: { id }
    }
  }
) =>
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ uris: spotify_uri }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

export const play = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const ready = state.player.spotifyReady && state.player.youtubeReady;
    if (!ready) {
      return;
    }
    dispatch({
      type: 'PLAY'
    });
    const position = state.queue.position;
    const song = state.queue.queue.get(position);
    return window.player
      .pause()
      .then(() => window.ytPlayer.stopVideo())
      .then(
        () =>
          song.youtube
            ? window.ytPlayer.loadVideoById(song.track.id)
            : apiPlay(state.token.token, {
                playerInstance: window.player,
                spotify_uri: [song.track.uri]
              })
      );
  };
};
export const nextSong = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'NEXT_SONG'
    });
    return dispatch(play());
  };
};

export const prevSong = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'PREV_SONG'
    });
    return dispatch(play());
  };
};

export const togglePlay = () => {
  return async (dispatch, getState) => {
    const { spotifyPlayer, playing, ytPlayer } = getState().player;
    const position = getState().queue.position;
    const song = getState().queue.queue.get(position);
    dispatch({
      type: 'TOGGLE_PLAY'
    });

    if (playing) {
      return window.player.pause().then(() => window.ytPlayer.pauseVideo());
    } else {
      if (ytPlayer === 5 && !spotifyPlayer.context.uri) {
        return dispatch(play());
      }
      if (song.youtube) {
        window.ytPlayer.pauseVideo();
      } else if (song.spotify) {
        await window.player.pause();
      }
    }
  };
};
