export const playlistReducer = (
  state = { unifiedMenu: [], playlistMenu: [] },
  action
) => {
  switch (action.type) {
    case "ADD_UNIFIED_PLAYLIST":
      return {
        ...state,
        unifiedMenu: state.unifiedMenu.push({
          name: action.name,
          tracks: action.tracks,
          id: action.id,
          owner: action.owner,
          unified: true
        })
      };
    case "FETCH_PLAYLIST_MENU_PENDING":
      return {
        ...state,
        fetchPlaylistPending: true
      };

    case "FETCH_PLAYLIST_MENU_SUCCESS":
      return {
        ...state,
        playlistMenu: action.playlists,
        playlists: action.playlists,
        fetchPlaylistError: false,
        fetchPlaylistPending: false
      };
    case "FETCH_UNIFIED_PLAYLIST_MENU":
      return {
        ...state,
        unifiedMenu: action.playlists
      };

    case "ADD_PLAYLIST_ITEM":
      return {
        ...state,
        playlists: [...state.playlists, action.playlist]
      };

    case "DELETE_UNIFIED_PLAYLIST":
      return {
        ...state,
        unifiedMenu: state.unifiedMenu.delete(
          state.unifiedMenu.findIndex(t => t.id === action.id)
        )
      };

    default:
      return state;
  }
};

export default playlistReducer;
