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
  shuffleQueue,
  clearSongQueue
} from '../../actions/queueActions';
import * as Fuse from 'fuse.js';
import { List } from 'immutable';

const mapStateToProps = state => {
  const options = {
    threshold: 0.3,
    keys: [
      { name: 'track.artists.name', weight: 0.5 },
      { name: 'track.album.name', weight: 0.3 },
      { name: 'track.name', weight: 1 }
    ]
  };
  const fuse = new Fuse(state.songsReducer.songs.toJS(), options);
  const filter = state.ui.filter;
  return {
    songs:
      filter.length > 0
        ? List(fuse.search(state.ui.filter))
        : state.songsReducer.songs,
    songId: state.songsReducer.songId,
    sort: state.ui.sort
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addSongToLibrary,
      addSongToQueue,
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
