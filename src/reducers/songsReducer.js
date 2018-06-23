import { List } from 'immutable';
import { isBefore } from 'date-fns';

const defaultState = {
  fetchSongsPending: true,
  songPlaying: false,
  timeElapsed: 0,
  songId: 0,
  viewType: 'songs',
  songPaused: true,
  spotifyTracks: List(),
  youtubeTracks: List()
};

export const songsReducer = (state = defaultState, action) => {
  const now = new Date();
  switch (action.type) {
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
        spotifyTracks: List(action.songs),
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
      return {
        ...state,
        youtubeTracks: state.youtubeTracks.push({
          youtube: true,
          added_at: now,
          track: {
            id: action.id,
            name: action.name
          }
        })
      };
    }

    case 'PLAY':
      return {
        ...state
      };

    default:
      return state;
  }
};

export default songsReducer;
