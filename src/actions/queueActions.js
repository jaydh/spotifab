import { List } from 'immutable';

export const updatePlayer = state => {
  return dispatch => {
    if (state) {
      if (state.position === state.duration) {
        dispatch(nextSong());
      }
      dispatch({
        type: 'UPDATE_SPOTIFY_PLAYER_STATE',
        state
      });
    }
  };
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
    const state = await getState();
    const ready = state.player.spotifyReady && state.player.youtubeReady;
    if (!ready) {
      return;
    }
    dispatch({
      type: 'PLAY'
    });

    const position = state.queue.position;
    const song = state.queue.queue.get(position);
    const firstYoutube = state.queue.queue.filter(t => t.youtube).first();
    return song.youtube
      ? window.ytPlayer.loadVideoById(song.track.id)
      : apiPlay(state.token.token, {
          playerInstance: window.player,
          spotify_uri: state.queue.queue
            .slice(position)
            .filter(t => t.spotify)
            .map(t => t.track.uri)
            .toArray()
        }).then(() => window.ytPlayer.cueVideoById(firstYoutube.track.id));
  };
};
export const nextSong = () => {
  const key = Math.random();
  const thunk = async (dispatch, getState) => {
    dispatch({
      type: 'CANCEL',
      meta: { debounce: { cancel: true, key } }
    });
    const queue = getState().queue;
    const position = queue.position;
    const next = queue.queue.get(
      position + 1 === queue.queue.size ? 0 : position + 1
    );
    const nextYoutube = queue.queue.find(
      (t, index) => index > position && t.youtube
    );
    const current = queue.queue.get(queue.position);
    let promise;
    if (next.spotify && current.spotify) {
      promise = window.player
        .nextTrack()
        .then(() =>
          window.ytPlayer.cueVideoById(
            nextYoutube ? nextYoutube.track.id : Promise.resolve()
          )
        );
    } else if (next.youtube && current.youtube) {
      promise = Promise.resolve(window.ytPlayer.loadVideoById(next.track.id));
    } else {
      const firstSpotify = queue.queue.filter(t => t.spotify).first().track;
      if (next.spotify) {
        promise =
          firstSpotify.id === next.track.id
            ? apiPlay(getState().token.token, {
                playerInstance: window.player,
                spotify_uri: queue.queue
                  .filter(t => t.spotify)
                  .map(t => t.track.uri)
                  .toArray()
              })
                .then(() => window.ytPlayer.stopVideo())
                .then(() =>
                  window.ytPlayer.cueVideoById(
                    nextYoutube ? nextYoutube.track.id : Promise.resolve()
                  )
                )
            : window.player.nextTrack().then(() => window.ytPlayer.stopVideo());
      } else {
        promise = window.player.pause().then(() => window.ytPlayer.playVideo());
      }
    }
    return promise.then(() =>
      dispatch({
        type: 'NEXT_SONG'
      })
    );
  };
  thunk.meta = {
    debounce: {
      time: '800',
      leading: true,
      trailing: false,
      key
    }
  };
  return thunk;
};

export const prevSong = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'PREV_SONG'
    });
    return window.player
      .pause()
      .then(() => window.ytPlayer.stopVideo())
      .then(() => dispatch(play()));
  };
};

export const togglePlay = () => {
  return async (dispatch, getState) => {
    const playing = getState().player.playing;
    if (playing) {
      return window.player
        .pause()
        .then(() => window.ytPlayer.pauseVideo())
        .then(() =>
          dispatch({
            type: 'TOGGLE_PLAY'
          })
        );
    } else {
      dispatch({
        type: 'TOGGLE_PLAY'
      });
      return dispatch(play());
    }
  };
};
