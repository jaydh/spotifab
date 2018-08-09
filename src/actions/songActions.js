import { List } from 'immutable';
import { youtubeAPI } from '../../src/apiKeys';
import { requestTokenRefresh } from './tokenActions';
import { database, app } from '../index';

export const addYoutubeSong = t => {
  return async (dispatch, getState) => {
    const name = t.snippet.title;
    const id = t.id.videoId;
    const ref = database
      .collection('userData')
      .doc(getState().userReducer.firebaseUser.uid)
      .collection('youtubeTracks')
      .doc(id);
    await ref.set({
      name,
      id,
      added_at: new Date().getTime()
    });

    dispatch({
      type: 'ADD_YOUTUBE_TRACK',
      id,
      name,
      added_at: new Date().getTime()
    });
  };
};

export const fetchYoutubeSongs = () => {
  return async (dispatch, getState) => {
    const user = getState().userReducer.firebaseUser;
    if (user) {
      const ref = database
        .collection('userData')
        .doc(user.uid)
        .collection('youtubeTracks');
      return ref.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const { id, name, added_at } = doc.data();
          dispatch({
            type: 'ADD_YOUTUBE_TRACK',
            id,
            name,
            added_at
          });
        });
      });
    }
  };
};

export const fetchSongsPending = () => {
  return {
    type: 'FETCH_SONGS_PENDING'
  };
};

export const fetchSongsSuccess = songs => {
  return {
    songs,
    type: 'FETCH_SONGS_SUCCESS'
  };
};

export const fetchSongsError = () => {
  return {
    type: 'FETCH_SONGS_ERROR'
  };
};

export const fetchSongs = () => {
  return async (dispatch, getState) => {
    dispatch(fetchSongsPending());
    const accessToken = getState().token.token;
    const fetches = [];
    dispatch(fetchSongsPending());
    let next = `https://api.spotify.com/v1/me/tracks?limit=50`;
    let tracks = List();
    const currentFirst = getState().songsReducer.spotifyTracks.get(0);
    while (next) {
      const request = new Request(next, {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      });
      const json = await (await fetch(request)).json();
      if (json.error) {
        dispatch(fetchSongsError());
      }
      if (currentFirst && json.items[0].track.id === currentFirst.track.id) {
        break;
      }
      tracks = tracks.concat(List(json.items));
      next = json.next;
    }
    dispatch(
      fetchSongsSuccess(
        tracks.map(t => {
          return {
            added_at: t.added_at,
            track: {
              album: t.track.album,
              artists: t.track.artists,
              id: t.track.id,
              name: t.track.name,
              uri: t.track.uri
            }
          };
        })
      )
    );
    return Promise.resolve();
  };
};

export const searchSongsPending = () => {
  return {
    type: 'SEARCH_SONGS_PENDING'
  };
};

export const searchSongsSuccess = songs => {
  return {
    songs,
    type: 'SEARCH_SONGS_SUCCESS'
  };
};

export const searchSongsError = () => {
  return {
    type: 'SEARCH_SONGS_ERROR'
  };
};

export const searchSongs = (searchTerm, accessToken) => {
  return dispatch => {
    const request = new Request(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
      {
        headers: new Headers({
          Accept: 'application/json',
          Authorization: 'Bearer ' + accessToken
        })
      }
    );

    dispatch(searchSongsPending());

    fetch(request)
      .then(res => {
        if (res.statusText === 'Unauthorized') {
          window.location.href = './';
        }
        return res.json();
      })
      .then(res => {
        res.items = res.tracks.items.map(item => {
          return {
            track: item
          };
        });
        dispatch(searchSongsSuccess(res.items));
      })
      .catch(err => {
        dispatch(fetchSongsError(err));
      });
  };
};

export const fetchRecentlyPlayedPending = () => {
  return {
    type: 'FETCH_RECENTLY_PLAYED_PENDING'
  };
};

export const fetchRecentlyPlayedSuccess = songs => {
  return {
    songs,
    type: 'FETCH_RECENTLY_PLAYED_SUCCESS'
  };
};

export const fetchRecentlyPlayedError = () => {
  return {
    type: 'FETCH_RECENTLY_PLAYED_ERROR'
  };
};

export const fetchRecentlyPlayed = () => {
  return (dispatch, getState) => {
    const accessToken = getState().token.token;
    const request = new Request(
      `https://api.spotify.com/v1/me/player/recently-played`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    );

    dispatch(fetchRecentlyPlayedPending());

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(res => {
        dispatch(fetchRecentlyPlayedSuccess(List(res.items)));
      });
  };
};

export const play = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'PLAY'
    });

    const position = getState().queue.position;
    const next = getState().queue.queue.get(position);
    const apiPlay = async ({
      spotify_uri,
      playerInstance: {
        _options: { getOAuthToken, id }
      }
    }) =>
      getOAuthToken(accessToken =>
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: spotify_uri }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
      );
    if (next.youtube) {
      window.player.pause();
      window.ytPlayer.loadVideoById(next.track.id);
    } else {
      window.ytPlayer.pauseVideo();
      return apiPlay({
        playerInstance: window.player,
        spotify_uri: [next.track.uri]
      });
    }
  };
};

export const togglePlay = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'TOGGLE_PLAY'
    });

    const track = getState().queue.currentTrack;
    if (!track) {
      window.ytPlayer.pauseVideo();
      const state = await window.player.getCurrentState();
      state ? window.player.togglePlay() : dispatch(play());
    } else if (!track.uri) {
      window.ytPlayer.getPlayerState() === 1
        ? window.ytPlayer.pauseVideo()
        : window.ytPlayer.playVideo();
    } else {
      const state = await window.player.getCurrentState();
      state ? window.player.togglePlay() : dispatch(play());
    }
  };
};
export const nextSong = () => {
  return (dispatch, getState) => {
    dispatch({
      type: 'NEXT_SONG'
    });
    dispatch(play());
  };
};
export const prevSong = () => {
  return (dispatch, getState) => {
    dispatch({
      type: 'PREV_SONG'
    });
    dispatch(play());
  };
};

export const updateViewType = view => {
  return {
    type: 'UPDATE_VIEW_TYPE',
    view
  };
};

export const seek = time => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEEK'
    });
    console.log(time);
    const track = getState().queue.currentTrack;
    if (!track) {
      window.ytPlayer.pauseVideo();
      const state = await window.player.getCurrentState();
      state ? window.player.togglePlay() : dispatch(play());
    } else if (!track.uri) {
      window.ytPlayer.seekTo(time / 1000, true);
    } else {
      window.player.seek(time);
    }
  };
};

export const addSpotifySong = track => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    await fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: 'PUT',
      body: JSON.stringify({
        ids: [track.id]
      }),
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken
      })
    });
    dispatch({ type: 'ADD_SONG_TO_LIBRARY', track });
  };
};

export const removeSpotifySong = track => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    await fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: 'DELETE',
      body: JSON.stringify({
        ids: [track.id]
      }),
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken
      })
    });
    dispatch({ type: 'REMOVE_SONG_FROM_LIBRARY', track });
  };
};
