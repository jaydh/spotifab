import SongList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSongs } from '../../actions/songActions';
import { play } from '../../actions/queueActions';
import { addSongToLibrary } from '../../actions/userActions';
import {
  addSongToQueue,
  addSongToFront,
  insertSongInQueue,
  makeNewQueue,
  shuffleQueue,
  clearSongQueue
} from '../../actions/queueActions';
import * as Fuse from 'fuse.js';
import { List } from 'immutable';
import { isBefore, parse } from 'date-fns';

const mapStateToProps = (state, ownProps) => {
  const options = {
    threshold: 0.3,
    keys: [
      { name: 'track.artists.name', weight: 0.5 },
      { name: 'track.album.name', weight: 0.3 },
      { name: 'track.name', weight: 1 }
    ]
  };
  const library = (ownProps.isLibrary
    ? state.songsReducer.spotifyTracks.concat(state.songsReducer.youtubeTracks)
    : state.songsReducer.playlistSongs
  ).sort((a, b) => sortBy(state.ui.sort, a, b));
  const fuse = new Fuse(library.toJS(), options);
  const filter = state.ui.filter;
  return {
    songs: filter.length > 0 ? List(fuse.search(state.ui.filter)) : library,
    songId: state.songsReducer.songId,
    sort: state.ui.sort
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addSongToLibrary,
      addSongToQueue,
      makeNewQueue,
      insertSongInQueue,
      addSongToFront,
      shuffleQueue,
      clearSongQueue,
      play
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);

const sortBy = (sort, a, b) => {
  switch (sort) {
    case 'added-asc':
      return isBefore(parse(a.added_at), parse(b.added_at)) ? 1 : -1;
    case 'added-desc':
      return isBefore(parse(a.added_at), parse(b.added_at)) ? -1 : 1;
    case 'name-asc':
      return a.track.name
        .toLowerCase()
        .localeCompare(b.track.name.toLowerCase());
    case 'name-desc':
      return b.track.name
        .toLowerCase()
        .localeCompare(a.track.name.toLowerCase());
    case 'artist-asc':
      if (!a.track.artists) {
        return -1;
      }
      if (!b.track.artists) {
        return 1;
      }
      return a.track.artists[0].name
        .toLowerCase()
        .localeCompare(b.track.artists[0].name.toLowerCase());
    case 'artist-desc':
      if (!a.track.artists) {
        return -1;
      }
      if (!b.track.artists) {
        return 1;
      }
      b.track.artists[0].name
        .toLowerCase()
        .localeCompare(a.track.artists[0].name.toLowerCase());
    case 'album-asc':
      if (!a.track.album) {
        return -1;
      }
      if (!b.track.album) {
        return 1;
      }
      return a.track.album.name
        .toLowerCase()
        .localeCompare(b.track.album.name.toLowerCase());
    case 'album-desc':
      if (!a.track.album) {
        return -1;
      }
      if (!b.track.album) {
        return 1;
      }
      return b.track.album.name
        .toLowerCase()
        .localeCompare(a.track.album.name.toLowerCase());

    default:
      return a;
  }
};
