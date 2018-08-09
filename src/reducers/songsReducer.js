import { List } from 'immutable';
import { isBefore, parse } from 'date-fns';

const defaultState = {
  fetchSongsPending: true,
  songPlaying: false,
  timeElapsed: 0,
  songId: 0,
  viewType: 'songs',
  songPaused: true,
  songs: List(),
  youtubeTracks: List(),
  spotifyTracks: List()
};

export const songsReducer = (state = defaultState, action) => {
  const now = new Date();
  switch (action.type) {
    case 'ADD_SONG_TO_LIBRARY':
      return {
        ...state,
        songs: state.songs.insert(0, {
          added_at: new Date().getTime(),
          track: action.track
        }),
        spotifyTracks: state.spotifyTracks.insert(0, {
          added_at: new Date().getTime(),
          track: action.track
        })
      };
    case 'REMOVE_SONG_FROM_LIBRARY':
      const index = state.songs.findIndex(t => t.track.id === action.track.id);
      return {
        ...state,
        songs: state.songs.delete(index),
        spotifyTracks: state.spotifyTracks.delete(index)
      };

    case 'UPDATE_VIEW_TYPE':
      return {
        ...state,
        viewType: action.view
      };

    case 'FETCH_SONGS_PENDING':
      return {
        ...state,
        fetchSongsPending: true
      };

    case 'FETCH_SONGS_SUCCESS':
      return {
        ...state,
        songs: action.songs.isEmpty()
          ? state.songs
          : state.youtubeTracks.concat(action.songs),
        spotifyTracks: action.songs,
        fetchSongsError: false,
        fetchSongsPending: false
      };

    case 'FETCH_SONGS_ERROR':
      return {
        ...state,
        fetchSongsError: true,
        fetchSongsPending: false
      };

    case 'SEARCH_SONGS_PENDING':
      return {
        ...state,
        searchSongsPending: true
      };

    case 'SEARCH_SONGS_SUCCESS':
      return {
        ...state,
        spotifyTracks: List(action.songs),
        searchSongsError: false,
        searchSongsPending: false,
        viewType: 'search'
      };

    case 'SEARCH_SONGS_ERROR':
      return {
        ...state,
        searchSongsError: true,
        searchSongsPending: false
      };

    case 'FETCH_RECENTLY_PLAYED_PENDING':
      return {
        ...state,
        fetchSongsPending: true
      };

    case 'FETCH_RECENTLY_PLAYED_SUCCESS':
      return {
        ...state,
        spotifyTracks: List(action.songs),
        viewType: 'Recently Played',
        fetchSongsError: false,
        fetchSongsPending: false
      };

    case 'FETCH_RECENTLY_PLAYED_ERROR':
      return {
        ...state,
        fetchSongsError: true,
        fetchSongsPending: false
      };

    case 'FETCH_PLAYLIST_SONGS_PENDING':
      return {
        ...state,
        fetchPlaylistSongsPending: true
      };

    case 'FETCH_PLAYLIST_SONGS_SUCCESS':
      return {
        ...state,
        songs: List(action.songs),
        viewType: 'playlist',
        fetchPlaylistSongsError: false,
        fetchPlaylistSongsPending: false
      };

    case 'FETCH_PLAYLIST_SONGS_ERROR':
      return {
        ...state,
        fetchPlaylistSongsError: true,
        fetchPlaylistSongsPending: false
      };

    case 'FETCH_ARTIST_SONGS_PENDING':
      return {
        ...state,
        fetchArtistSongsPending: true
      };

    case 'FETCH_ARTIST_SONGS_SUCCESS':
      return {
        ...state,
        spotifyTracks: action.songs,
        viewType: 'Artist',
        fetchArtistSongsError: false,
        fetchArtistSongsPending: false
      };

    case 'FETCH_ARTIST_SONGS_ERROR':
      return {
        ...state,
        fetchArtistSongsError: true,
        fetchArtistSongsPending: false
      };
    case 'ADD_YOUTUBE_TRACK': {
      const track = {
        youtube: true,
        added_at: action.added_at,
        track: {
          id: action.id,
          name: action.name
        }
      };
      return {
        ...state,
        songs: state.songs.find(t => t.track.id === action.id)
          ? state.songs
          : state.songs.push(track),
        youtubeTracks: state.youtubeTracks.find(t => t.track.id === action.id)
          ? state.youtubeTracks
          : state.youtubeTracks.push(track)
      };
    }

    case 'PLAY':
      return {
        ...state
      };
    case 'SET_SORT':
      return {
        ...state,
        songs: state.songs.sort((a, b) => {
          switch (action.sort) {
            case 'added-asc':
              return isBefore(parse(a.added_at), parse(b.added_at)) ? 1 : -1;
            case 'added-desc':
              return isBefore(parse(a.added_at), parse(b.added_at)) ? -1 : 1;
            case 'name-asc':
              return a.track.name < b.track.name ? -1 : 1;
            case 'name-desc':
              return a.track.name < b.track.name ? 1 : -1;
            case 'artist-asc':
              if (!a.track.artists) {
                return -1;
              }
              if (!b.track.artists) {
                return 1;
              }
              return a.track.artists[0].name < b.track.artists[0].name ? -1 : 1;
            case 'artist-desc':
              if (!a.track.artists) {
                return -1;
              }
              if (!b.track.artists) {
                return 1;
              }
              return a.track.artists[0].name < b.track.artists[0].name ? 1 : -1;
            default:
              return a;
          }
        })
      };

    default:
      return state;
  }
};

export default songsReducer;
