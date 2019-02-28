export default (
  state = {
    queue: [],
    repeat: true,
    position: 0
  },
  action
) => {
  switch (action.type) {
    case "PLAY":
      return {
        ...state
      };
    case "TOGGLE_REPEAT":
      return {
        ...state,
        repeat: !state.repeat
      };
    case "CLEAR_QUEUE":
      return {
        ...state,
        queue: [],
        position: 0
      };
    case "ADD_SONG_TO_NEXT":
      return {
        ...state,
        queue: state.queue.insert(state.position, action.song)
      };
    case "ADD_SELECTED_TO_QUEUE":
      return { ...state, queue: state.queue.concat(action.selectedSongs) };
    case "REMOVE_SONG_FROM_QUEUE":
      const copyre = state.queue.slice(0);
      copyre.splice(action.position, 1);
      return {
        ...state,
        queue: copyre
      };

    case "MAKE_NEW_QUEUE": {
      return { ...state, queue: action.songs, position: 0 };
    }
    case "PREV_SONG": {
      const nextPos =
        state.position - 1 < 0 && state.repeat
          ? state.queue.size - 1
          : state.position - 1;
      return {
        ...state,
        position: nextPos
      };
    }
    case "NEXT_SONG": {
      const nextPos =
        state.position + 1 >= state.queue.size && state.repeat
          ? 0
          : state.position + 1;
      return {
        ...state,
        position: nextPos
      };
    }
    case "ADD_SONG_TO_QUEUE":
      const next = state.queue.slice(0);
      next.push(action.song);
      return {
        ...state,
        queue: next
      };
    case "SHUFFLE_QUEUE":
      if (state.queue.length === 0) {
        return state;
      }
      const pos = state.position;
      const end = state.queue.length - 1;
      const shuffled = shuffle(Array.from(state.queue).slice(pos + 1, end));
      return {
        ...state,
        queue: state.queue.slice(0, pos + 1).concat(shuffled)
      };
    case "INSERT_SONG_IN_QUEUE":
      const copy = state.queue.slice(0);
      copy.splice(action.position, 0, action.track);
      return {
        ...state,
        queue: copy
      };
    case "UPDATE_POSITION":
      return {
        ...state,
        position: action.position
      };
    default:
      return state;
  }
};

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
