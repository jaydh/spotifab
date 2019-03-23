export default (
  state = {
    filter: "",
    sort: "added-asc",
    upSelector: undefined,
    downSelector: undefined,
    selectedSongs: [],
    sideMenuOpen: false,
    queueOpen: false,
    showYoutube: true,
    showSpotify: true
  },
  action: any
) => {
  switch (action.type) {
    case "OPEN_SIDE_MENU":
      return { ...state, sideMenuOpen: true, queueOpen: false };
    case "CLOSE_SIDE_MENU":
      return { ...state, sideMenuOpen: false };
    case "OPEN_QUEUE": {
      return { ...state, queueOpen: true, sideMenuOpen: false };
    }
    case "CLOSE_QUEUE":
      return { ...state, queueOpen: false };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "TOGGLE_SHOW_YOUTUBE":
      return { ...state, showYoutube: !state.showYoutube };
    case "TOGGLE_SHOW_SPOTIFY":
      return { ...state, showSpotify: !state.showSpotify };

    case "SET_SONG_SELECTION":
      return {
        ...state,
        upSelector: action.upSelector ? action.upSelector : state.upSelector,
        downSelector: action.downSelector
          ? action.downSelector
          : state.downSelector,
        selectedSongs: action.selectedSongs
      };
    case "CLEAR_SELECTION":
      return { ...state, upSelector: undefined, downSelector: undefined };
    default:
      return state;
  }
};
