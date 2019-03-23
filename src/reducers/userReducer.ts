export const userReducer = (
  state = {
    signedIn: false,
    spotifyEnabled: false,
    youtubeEnabled: true,
    soundcloud: false,
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

    case "SIGN_IN":
      return { ...state, signedIn: true, user: action.user };
      break;

    case "SIGN_OUT":
      return { ...state, signedIn: false, user: null };
      break;

    default:
      return state;
  }
};

export default userReducer;
