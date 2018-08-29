import { List } from 'immutable';
import { parse } from 'date-fns';
import { database, app } from '../index';
import hash from 'string-hash';

export const addUnifiedPlaylist = name => {
  return async (dispatch, getState) => {
    const tracks = getState().queue.queue;
    const batch = database.batch();
    const id = hash(name).toString();
    dispatch({
      type: 'ADD_UNIFIED_PLAYLIST',
      name,
      id,
      owner: { id: getState().userReducer.firebaseUser.uid },
      tracks
    });

    const ref = database
      .collection('userData')
      .doc(getState().userReducer.firebaseUser.uid)
      .collection('playlists')
      .doc(id);

    batch.set(ref, {
      name,
      id,
      owner: { id: getState().userReducer.firebaseUser.uid }
    });
    tracks.forEach(t => {
      batch.set(ref.collection('tracks').doc(t.track.id), t);
    });
    return batch.commit();
  };
};

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
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistMenuPending());

    const res = await (await fetch(`https://api.spotify.com/v1/me/playlists`, {
      headers: new Headers({
        Authorization: 'Bearer ' + accessToken
      })
    })).json();
    dispatch(
      fetchPlaylistMenuSuccess(
        res.items.map(t => {
          return { ...t, spotify: true };
        })
      )
    );
  };
};

export const fetchUnifiedPlaylistMenu = () => {
  return (dispatch, getState) => {
    const ref = database
      .collection('userData')
      .doc(getState().userReducer.firebaseUser.uid)
      .collection('playlists');
    return ref.get().then(query => {
      const playlists = [];
      query.forEach(doc =>
        playlists.push({
          name: doc.data().name,
          id: doc.data().id,
          owner: doc.data().owner,
          unified: true
        })
      );
      dispatch({ type: 'FETCH_UNIFIED_PLAYLIST_MENU', playlists });
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
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
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

export const fetchUnifiedSongs = (userId, playlistId) => {
  return async (dispatch, getState) => {
    dispatch(fetchPlaylistSongsPending());
    const ref = database
      .collection('userData')
      .doc(getState().userReducer.firebaseUser.uid)
      .collection('playlists')
      .doc(playlistId)
      .collection('tracks');
    return ref.get().then(query => {
      const tracks = [];
      query.forEach(doc => tracks.push(doc.data()));
      dispatch(fetchPlaylistSongsSuccess(tracks));
    });
  };
};
export const deleteUnifiedPlaylist = id => {
  return async (dispatch, getState) => {
    dispatch({ type: 'DELETE_UNIFIED_PLAYLIST', id });
    const ref = database
      .collection('userData')
      .doc(getState().userReducer.firebaseUser.uid)
      .collection('playlists')
      .doc(id);
    return ref.delete();
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
