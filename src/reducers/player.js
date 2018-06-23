export default (
  state = {
    volume: 0.5,
    spotifyPlayer: null,
    ytPlayer: null,
    playing: false
  },
  action
) => {
  switch (action.type) {
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing };
    case 'UPDATE_VOLUME':
      return {
        ...state,
        volume: action.volume
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token
      };
    case 'UPDATE_SPOTIFY_PLAYER_STATE':
      return { ...state, spotifyPlayer: action.state };
    case 'UPDATE_YOUTUBE_PLAYER_STATE':
      return { ...state, ytPlayer: action.state };
    default:
      return state;
  }
};
