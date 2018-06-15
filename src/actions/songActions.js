import uniqBy from 'lodash/uniqBy';
import { setArtistIds } from './artistActions';

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
  return (dispatch, getState) => {
    const accessToken = getState().player.token;
    for (let i = 0; i < 10; i++) {
      const request = new Request(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${i * 50}`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + accessToken
          })
        }
      );
      dispatch(fetchSongsPending());
      fetch(request)
        .then(res => {
          if (res.statusText === 'Unauthorized') {
            window.location.href = './';
          }
          return res.json();
        })
        .then(res => {
          // get all artist ids and remove duplicates
          let artistIds = uniqBy(res.items, item => {
            return item.track.artists[0].name;
          })
            .map(item => {
              return item.track.artists[0].id;
            })
            .join(',');

          dispatch(setArtistIds(artistIds));
          dispatch(fetchSongsSuccess(res.items));
        })
        .catch(err => {
          dispatch(fetchSongsError(err));
        });
    }
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

export const fetchRecentlyPlayed = accessToken => {
  return dispatch => {
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
        //remove duplicates from recently played
        res.items = uniqBy(res.items, item => {
          return item.track.id;
        });
        dispatch(fetchRecentlyPlayedSuccess(res.items));
      })
      .catch(err => {
        dispatch(fetchRecentlyPlayedError(err));
      });
  };
};

export const play = () => {
  return (dispatch, getState) => {
    const token = getState().player.token;
    const songs = getState().player.activeQueue;
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
    apiPlay({
      playerInstance: window.player,
      spotify_uri: songs.map(t => t.track.uri).toJS()
    });
    dispatch({
      type: 'PLAY'
    });
  };
};

export const pauseSong = () => {
  return dispatch => {
    window.player.togglePlay();
    dispatch({
      type: 'PAUSE_SONG'
    });
  };
};

export const resumeSong = () => {
  return dispatch => {
    window.player.togglePlay();
    dispatch({
      type: 'RESUME_SONG'
    });
  };
};
export const nextSong = () => {
  return dispatch => {
    window.player.nextTrack();
    dispatch({
      type: 'NEXT_SONG'
    });
  };
};
export const prevSong = () => {
  return dispatch => {
    window.player.previousTrack();
    dispatch({
      type: 'PREV_SONG'
    });
  };
};

export const updateViewType = view => {
  return {
    type: 'UPDATE_VIEW_TYPE',
    view
  };
};
