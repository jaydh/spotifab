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
  return (dispatch, getState) => {
    const accessToken = getState().token.token;
    dispatch(fetchPlaylistSongsPending());

    fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        })
      }
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        dispatch(fetchPlaylistSongsSuccess(res.items));
      })
      .catch(err => {
        dispatch(fetchPlaylistSongsError(err));
      });
  };
};
