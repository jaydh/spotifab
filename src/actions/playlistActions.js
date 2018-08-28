import { List } from 'immutable';
import { parse } from 'date-fns';

export const fetchPlaylistMenuPending = () => {
  return {
    type: 'FETCH_PLAYLIST_MENU_PENDING'
  };
};

export const fetchPlaylistMenuSuccess = playlists => {
  return {
    playlists,
    type: 'FETCH_PLAYLIST_MENU_SUCCESS'
  };
};

export const fetchPlaylistMenuError = () => {
  return {
    type: 'FETCH_PLAYLIST_MENU_ERROR'
  };
};

export const addPlaylistItem = playlist => {
  return {
    playlist,
    type: 'ADD_PLAYLIST_ITEM'
  };
};

export const fetchPlaylistsMenu = () => {
  return (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistMenuPending());

    fetch(`https://api.spotify.com/v1/me/playlists`, {
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken
      })
    })
      .then(res => {
        if (res.statusText === 'Unauthorized') {
          window.location.href = './';
        }
        return res.json();
      })
      .then(res => {
        dispatch(fetchPlaylistMenuSuccess(res.items));
      })
      .catch(err => {
        dispatch(fetchPlaylistMenuError(err));
      });
  };
};

export const fetchPlaylistSongsPending = () => {
  return {
    type: 'FETCH_PLAYLIST_SONGS_PENDING'
  };
};

export const fetchPlaylistSongsSuccess = songs => {
  return {
    songs,
    type: 'FETCH_PLAYLIST_SONGS_SUCCESS'
  };
};

export const fetchPlaylistSongsError = () => {
  return {
    type: 'FETCH_PLAYLIST_SONGS_ERROR'
  };
};

export const fetchPlaylistSongs = (userId, playlistId) => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    );
    const json = await res.json();
    dispatch(
      fetchPlaylistSongsSuccess(
        json.items.map(t => {
          return { ...t, spotify: true };
        })
      )
    );
  };
};

export const fetchRecent = () => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    );
    const json = await res.json();
    dispatch(
      fetchPlaylistSongsSuccess(
        json.items.map(t => {
          return { ...t, spotify: true };
        })
      )
    );
  };
};

export const fetchNew = () => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());
    const res = await (await fetch(
      `https://api.spotify.com/v1/browse/new-releases?country=US&limit=20`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    )).json();
    console.log(res);
    const trackArrays = await Promise.all(
      res.albums.items.map(async t => {
        const tracks = await (await fetch(
          `https://api.spotify.com/v1/albums/${t.id}/tracks`,
          {
            headers: new Headers({
              Authorization: 'Bearer ' + accessToken
            })
          }
        )).json();

        return tracks.items.map(track => {
          return {
            added_at: parse(t.release_date),
            spotify: true,
            track: { ...track, album: t }
          };
        });
      })
    );
    dispatch(fetchPlaylistSongsSuccess([].concat.apply([], trackArrays)));
  };
};

export const createNewPlaylist = (name, description) => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    const userId = getState().userReducer.user.id;
    const trackURIs = getState().queue.queue.map(t => t.track.uri);
    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        public: true
      }),
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken
      })
    });
    const playlists = (await (await fetch(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    )).json()).items;
    const newPlaylist = List(playlists).filter(t => t.name === name);
    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${
        newPlaylist.get(0).id
      }/tracks`,
      {
        method: 'POST',
        body: JSON.stringify({
          uris: trackURIs
        }),
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    );
    dispatch(fetchPlaylistsMenu());
  };
};

export const unfollowPlaylist = id => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    const userId = getState().userReducer.user.id;
    console.log('ehy');
    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${id}/followers`,
      {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    );
    dispatch(fetchPlaylistsMenu());
  };
};
