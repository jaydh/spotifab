const defaultState = {
  fetchSongsPending: true,
  songPlaying: false,
  timeElapsed: 0,
  songId: 0,
  viewType: "songs",
  songPaused: true,
  youtubeTracks: [],
  spotifyTracks: [],
  playlistSongs: []
};

export const songsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_SONG_TO_LIBRARY":
      const next = state.spotifyTracks.slice(0);
      next.unshift({
        added_at: new Date().getTime(),
        track: action.track
      });
      return {
        ...state,
        spotifyTracks: next
      };
    case "REMOVE_SONG_FROM_LIBRARY": {
      const spotifyIndex = state.spotifyTracks.findIndex(
        t => t.track.id === action.id
      );
      const copyre = state.spotifyTracks.slice(0);
      copyre.splice(spotifyIndex, 1);

      return {
        ...state,
        spotifyTracks: copyre
      };
    }
    case "REMOVE_YOUTUBE_TRACK": {
      const youtubeIndex = state.youtubeTracks.findIndex(
        t => t.youbue && t.track.id === action.id
      );
      const copyre = state.youtubeTracks.slice(0);
      copyre.splice(youtubeIndex, 1);

      return {
        ...state,
        youtubeTracks: copyre
      };
    }
    case "UPDATE_VIEW_TYPE":
      return {
        ...state,
        viewType: action.view
      };

    case "FETCH_SONGS_PENDING":
      return {
        ...state,
        fetchSongsPending: true
      };

    case "FETCH_SONGS_SUCCESS":
      return {
        ...state,
        spotifyTracks:
          action.songs.length === 0 ? state.spotifyTracks : action.songs
      };

    case "FETCH_SONGS_ERROR":
      return {
        ...state
      };

    case "SEARCH_SONGS_PENDING":
      return {
        ...state
      };

    case "SEARCH_SONGS_SUCCESS":
      return {
        ...state,
        spotifyTracks: action.songs,
        viewType: "search"
      };

    case "SEARCH_SONGS_ERROR":
      return {
        ...state,
        searchSongsError: true,
        searchSongsPending: false
      };

    case "FETCH_RECENTLY_PLAYED_PENDING":
      return {
        ...state,
        fetchSongsPending: true
      };

    case "FETCH_RECENTLY_PLAYED_SUCCESS":
      return {
        ...state,
        spotifyTracks: action.songs,
        viewType: "Recently Played",
        fetchSongsError: false,
        fetchSongsPending: false
      };

    case "FETCH_RECENTLY_PLAYED_ERROR":
      return {
        ...state,
        fetchSongsError: true,
        fetchSongsPending: false
      };

    case "FETCH_PLAYLIST_SONGS_PENDING":
      return {
        ...state,
        fetchPlaylistSongsPending: true
      };

    case "FETCH_PLAYLIST_SONGS_SUCCESS":
      return {
        ...state,
        playlistSongs: action.songs,
        fetchPlaylistSongsError: false,
        fetchPlaylistSongsPending: false
      };

    case "FETCH_PLAYLIST_SONGS_ERROR":
      return {
        ...state,
        fetchPlaylistSongsError: true,
        fetchPlaylistSongsPending: false
      };

    case "FETCH_ARTIST_SONGS_PENDING":
      return {
        ...state,
        fetchArtistSongsPending: true
      };

    case "FETCH_ARTIST_SONGS_SUCCESS":
      return {
        ...state,
        spotifyTracks: action.songs,
        viewType: "Artist",
        fetchArtistSongsError: false,
        fetchArtistSongsPending: false
      };

    case "FETCH_ARTIST_SONGS_ERROR":
      return {
        ...state,
        fetchArtistSongsError: true,
        fetchArtistSongsPending: false
      };
    case "ADD_YOUTUBE_TRACK": {
      const track = {
        youtube: true,
        added_at: action.added_at,
        track: {
          id: action.id,
          name: action.name,
          duration_ms: action.durationMs
        }
      };
      const next = state.youtubeTracks.slice(0);
      if (state.youtubeTracks.find(t => t.track.id === action.id)) {
        next.push(track);
      }

      return {
        ...state,
        youtubeTracks: next
      };
    }
    case "FETCH_YOUTUBE_TRACKS_SUCCESS": {
      return { ...state, youtubeTracks: action.youtubeTracks };
    }

    case "PLAY":
      return {
        ...state
      };
    default:
      return state;
  }
};

export default songsReducer;
