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
