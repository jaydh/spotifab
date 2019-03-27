import { produce } from "immer";

interface ISong {
  spotify?: boolean;
  youtube?: boolean;
  added_at: number;
  track: {
    album?: any;
    artists?: any;
    id: string;
    name: string;
    duration_ms: number;
  };
}

export const songsReducer = (
  state = {
    youtubeIDs: [] as string[],
    spotifyIDs: [] as string[],
    youtubeTracks: {} as any,
    spotifyTracks: {} as any,
    playlistSongs: [],
    playlistName: undefined
  },
  action: any
) =>
  produce(state, draft => {
    switch (action.type) {
      case "ADD_SONG_TO_LIBRARY":
        const { id } = action.track;
        draft.spotifyIDs.push(id);
        draft.spotifyTracks[id] = {
          spotify: true,
          added_at: new Date().getTime(),
          track: action.track
        };
        break;

      case "REMOVE_SONG_FROM_LIBRARY": {
        const index = state.spotifyIDs.findIndex(
          (id: string) => id === action.id
        );
        if (index > -1) {
          draft.spotifyIDs.splice(index, 1);
          delete draft.spotifyTracks[id];
        }
        break;
      }

      case "REMOVE_YOUTUBE_TRACK": {
        const index = state.youtubeIDs.findIndex(
          (id: string) => id === action.id
        );
        if (index > -1) {
          draft.youtubeIDs.splice(index, 1);
          delete draft.youtubeTracks[id];
        }
        break;
      }

      case "FETCH_SONGS_SUCCESS":
        const ids = action.songs.map((t: ISong) => t.track.id);
        draft.spotifyIDs = ids;
        draft.spotifyTracks = {};
        action.songs.forEach(
          (t: ISong) => (draft.spotifyTracks[t.track.id] = t)
        );
        break;

      case "FETCH_PLAYLIST_SONGS_SUCCESS":
        return {
          ...state,
          playlistName: action.name,
          playlistSongs: action.songs
        };

      case "ADD_YOUTUBE_TRACK": {
        const song = {
          youtube: true,
          added_at: action.added_at,
          track: { ...action.track }
        };
        draft.youtubeIDs.push(action.id);
        draft.youtubeTracks[action.id] = song;
        break;
      }

      case "FETCH_YOUTUBE_TRACKS_SUCCESS": {
        const ids = action.songs.map((t: ISong) => t.track.id);
        draft.youtubeIDs = ids;
        draft.youtubeTracks = {};
        action.songs.forEach(
          (t: ISong) => (draft.youtubeTracks[t.track.id] = t)
        );
        break;
      }

      case "CLEAR_PLAYLIST_NAME":
        draft.playlistName = undefined;
        break;
    }
  });

export default songsReducer;
