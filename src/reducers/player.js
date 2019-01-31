export default (
  state = {
    volume: 0.5,
    spotifyPlayer: null,
    ytPlayer: null,
    playing: false,
    muted: false,
    spotifyReady: false,
    youtubeReady: false
  },
  action
) => {
  switch (action.type) {
    case 'PLAY_SONG_SUCCESS':
      return { ...state, playing: true };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing };
    case 'UPDATE_VOLUME':
      return {
        ...state,
        volume: action.volume
      };
    case 'UPDATE_SPOTIFY_PLAYER_STATE':
      return { ...state, spotifyPlayer: action.state };
    case 'UPDATE_YOUTUBE_PLAYER_STATE':
      return { ...state, ytPlayer: action.state };
    case 'SPOTIFY_READY':
      return { ...state, spotifyReady: true };
    case 'YOUTUBE_READY':
      return { ...state, youtubeReady: true };
    default:
      return state;
  }
};
