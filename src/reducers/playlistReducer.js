import { List } from 'immutable';
export const playlistReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_PLAYLIST_MENU_PENDING':
      return {
        ...state,
        fetchPlaylistPending: true
      };

    case 'FETCH_PLAYLIST_MENU_SUCCESS':
      return {
        ...state,
        playlistMenu: List(action.playlists),
        playlists: List(action.playlists),
        fetchPlaylistError: false,
        fetchPlaylistPending: false
      };

    case 'ADD_PLAYLIST_ITEM':
      return {
        ...state,
        playlists: [...state.playlists, action.playlist]
      };

    case 'FETCH_PLAYLIST_MENU_ERROR':
      return {
        fetchPlaylistError: true,
        fetchPlaylistPending: false,
        ...state
      };

    default:
      return state;
  }
};

export default playlistReducer;
