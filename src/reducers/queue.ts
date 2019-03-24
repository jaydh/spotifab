import { produce } from "immer";

export default (
  state = {
    queue: [] as any[],
    repeat: true,
    position: 0
  },
  action: any
) =>
  produce(state, draft => {
    switch (action.type) {
      case "TOGGLE_REPEAT":
        draft.repeat = !state.repeat;
        break;

      case "CLEAR_QUEUE":
        draft.queue = [];
        draft.position = 0;
        break;

      case "ADD_SONG_TO_NEXT":
        draft.queue.unshift(state.position, action.song);
        break;

      case "ADD_SELECTED_TO_QUEUE":
        draft.queue = draft.queue.concat(action.selectedSongs);
        break;

      case "REMOVE_SONG_FROM_QUEUE":
        draft.queue.splice(action.position, 1);
        break;

      case "MAKE_NEW_QUEUE": {
        draft.queue = action.songs;
        draft.position = 0;
        break;
      }

      case "PREV_SONG": {
        draft.position =
          state.position - 1 < 0 && state.repeat
            ? state.queue.length - 1
            : state.position - 1;
        break;
      }

      case "NEXT_SONG": {
        draft.position =
          state.position + 1 >= state.queue.length && state.repeat
            ? 0
            : state.position + 1;
        break;
      }

      case "ADD_SONG_TO_QUEUE": {
        draft.queue.push(action.song);
        break;
      }

      case "SHUFFLE_QUEUE": {
        if (state.queue.length === 0) {
          break;
        }
        const pos = state.position;
        const end = state.queue.length - 1;
        const shuffled = shuffle(state.queue.slice(pos + 1, end + 1));
        draft.queue = state.queue.slice(0, pos + 1).concat(shuffled);
        break;
      }

      case "INSERT_SONG_IN_QUEUE": {
        const copy = state.queue.slice(0);
        draft.queue.splice(action.position, 0, action.track);
        break;
      }

      case "UPDATE_POSITION": {
        draft.position = action.position;
        break;
      }
    }
  });

function shuffle(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
