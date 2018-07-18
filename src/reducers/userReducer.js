export const userReducer = (
  state = {
    signedIn: false
  },
  action
) => {
  switch (action.type) {
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        user: action.user,
        fetchUserError: false
      };

    case 'FETCH_USER_ERROR':
      return {
        ...state,
        fetchUserError: true
      };

    case 'ADD_SONG_TO_LIBRARY_SUCCESS':
      return {
        ...state,
        songAddedToLibrary: true,
        songId: action.songId
      };

    case 'ADD_SONG_TO_LIBRARY_ERROR':
      return {
        ...state,
        songAddedToLibrary: false
      };
    case 'SIGN_IN':
      return { ...state, signedIn: true, firebaseUser: action.user };
    case 'SIGN_OUT':
      return { ...state, signedIn: false, firebaseUser: null };

    default:
      return state;
  }
};

export default userReducer;
