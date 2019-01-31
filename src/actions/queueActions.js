export const updatePlayer = state => {
  return { type: "UPDATE_PLAYER" };
};

export const toggleRepeat = () => {
  return {
    type: "TOGGLE_REPEAT"
  };
};

export const updateCurrentTrack = track => {
  return {
    type: "UPDATE_CURRENT_TRACK",
    track
  };
};

export const addSongToQueue = song => {
  return {
    type: "ADD_SONG_TO_QUEUE",
    song
  };
};

export const makeNewQueue = songs => {
  return {
    type: "MAKE_NEW_QUEUE",
    songs
  };
};

export const clearSongQueue = () => {
  return {
    type: "CLEAR_QUEUE"
  };
};

export const shuffleQueue = () => {
  return {
    type: "SHUFFLE_QUEUE"
  };
};
export const addSongToNext = song => {
  return {
    type: "ADD_SONG_TO_NEXT",
    song
  };
};
export const removeSongFromQueue = position => {
  return {
    type: "REMOVE_SONG_FROM_QUEUE",
    position
  };
};

export const insertSongInQueue = (track, position) => {
  return {
    type: "INSERT_SONG_IN_QUEUE",
    position,
    track
  };
};

export const updatePosition = position => {
  return {
    type: "UPDATE_POSITION",
    position
  };
};

export const play = () => {
  return {
    type: "PLAY_SONG_REQUESTED"
  };
};
export const nextSong = () => {
  return {
    type: "NEXT_SONG"
  };
};

export const prevSong = () => {
  return {
    type: "PREV_SONG"
  };
};

export const togglePlay = () => {
  return async (dispatch, getState) => {
    const { playing } = getState().player;
    const position = getState().queue.position;
    const song = getState().queue.queue[position];
    dispatch({
      type: "TOGGLE_PLAY"
    });
    const state = song.youtube
      ? window.ytPlayer.getPlayerState()
      : await window.player.getCurrentState();
    if (playing) {
      return window.player.pause().then(() => window.ytPlayer.pauseVideo());
    } else if (!state) {
      dispatch(play());
    } else {
      if (song.youtube) {
        state === 2 ? window.ytPlayer.playVideo() : dispatch(play());
      } else if (song.spotify) {
        state.paused ? window.player.resume() : dispatch(play());
      }
    }
  };
};
