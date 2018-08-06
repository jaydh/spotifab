import { List } from 'immutable';
import { youtubeAPI } from '../../src/apiKeys';
import { requestTokenRefresh } from './tokenActions';

export const addYoutubeSong = id => {
  return async dispatch => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${youtubeAPI}&part=snippet&id=${id}`
    );
    const json = await res.json();
    dispatch({
      type: 'ADD_YOUTUBE_TRACK',
      id: json.items['0'].id,
      name: json.items['0'].snippet.title
    });
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
    const accessToken = getState().token.token;
    const fetches = [];
    dispatch(fetchSongsPending());
    for (let i = 0; i < 8; i++) {
      const request = new Request(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${i * 50}`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + accessToken
          })
        }
      );
      fetches.push(request);
    }
    const data = await Promise.all(fetches.map(t => fetch(t)));
    const json = await Promise.all(data.map(t => t.json()));
    const items = List(json.map(re => re.items).reduce((a, b) => [...a, ...b]));
    dispatch(fetchSongsSuccess(items));
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
