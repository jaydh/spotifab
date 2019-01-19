export default (
  state = {
    filter: "",
    sort: "added-asc",
    upSelector: undefined,
    downSelector: undefined,
    selectedSongs: [],
    firebaseLoaded: false,
    sideMenuOpen: false,
    queueOpen: false
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
    case "FIREBASE_LOADED":
      return { ...state, firebaseLoaded: true };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_SORT":
      return { ...state, sort: action.sort };
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
