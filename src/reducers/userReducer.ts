interface IServices {
  spotify: boolean;
  youtube: boolean;
  soundcloud: boolean;
}
export const userReducer = (
  state = {
    signedIn: false,
    spotifyEnabled: false,
    youtubeEnabled: true,
    soundcloud: false,
    spotifySignedIn: false,
    user: {}
  },
  action: any
) => {
  switch (action.type) {
    case "TOGGLE_SERVICE":
      if (action.service === "youtube") {
        return { ...state, youtubeEnabled: !state.youtubeEnabled };
      }
      if (action.service === "spotify") {
        return { ...state, spotifyEnabled: !state.spotifyEnabled };
      }
      break;

    case "ADD_SONG_TO_LIBRARY_SUCCESS":
      return {
        ...state,
        songAddedToLibrary: true,
        songId: action.songId
      };

    case "ADD_SONG_TO_LIBRARY_ERROR":
      return {
        ...state,
        songAddedToLibrary: false
      };
    case "SIGN_IN":
      return { ...state, signedIn: true, user: action.user };
    case "SIGN_OUT":
      return { ...state, signedIn: false, user: null };

    default:
      return state;
  }
};

export default userReducer;
