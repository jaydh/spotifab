export const fetchUserSuccess = user => {
  return {
    type: 'FETCH_USER_SUCCESS',
    user
  };
};

export const fetchUserError = () => {
  return {
    type: 'FETCH_USER_ERROR'
  };
};

export const fetchUser = () => {
  return (dispatch, getState) => {
    const request = new Request('https://api.spotify.com/v1/me', {
      headers: new Headers({
        Authorization: 'Bearer ' + getState().token.token
      })
    });

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(res => {
        dispatch(fetchUserSuccess(res));
      })
      .catch(err => {
        dispatch(fetchUserError(err));
      });
  };
};

export const addSongToLibrarySuccess = songId => {
  return {
    songId,
    type: 'ADD_SONG_TO_LIBRARY_SUCCESS'
  };
};

export const addSongToLibraryError = () => {
  return {
    type: 'ADD_SONG_TO_LIBRARY_ERROR'
  };
};

export const addSongToLibrary = (accessToken, id) => {
  return dispatch => {
    const request = new Request(
      `https://api.spotify.com/v1/me/tracks?ids=${id}`,
      {
        headers: new Headers({
          Authorization: 'Bearer ' + accessToken
        }),
        method: 'PUT'
      }
    );

    fetch(request)
      .then(res => {
        if (res.ok) {
          dispatch(addSongToLibrarySuccess(id));
        }
      })
      .catch(err => {
        dispatch(addSongToLibraryError(err));
      });
  };
};
