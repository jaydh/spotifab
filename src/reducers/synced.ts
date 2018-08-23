export default (
  state = {
    playlistSynced: false,
    songsSynced: false
  },
  action
) => {
  switch (action.type) {
    case 'FETCH_PLAYLIST_MENU_SUCCESS': {
      return { ...state, playlistSynced: true };
    }
    default:
      return state;
  }
};
