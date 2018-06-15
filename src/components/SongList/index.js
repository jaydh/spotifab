import SongList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { play, fetchSongs } from '../../actions/songActions';
import { addSongToLibrary } from '../../actions/userActions';
import {
  addSongToQueue,
  addSongToFront,
  shuffleQueue,
  clearSongQueue
} from '../../actions/queueActions';

const mapStateToProps = state => {
  return {
    songs: state.songsReducer.songs,
    fetchSongsError: state.songsReducer.fetchSongsError,
    fetchSongsPending: state.songsReducer.fetchSongsPending,
    fetchPlaylistSongsPending: state.songsReducer.fetchPlaylistSongsPending,
    songPlaying: state.songsReducer.songPlaying,
    songPaused: state.songsReducer.songPaused,
    songId: state.songsReducer.songId,
    songAddedId: state.userReducer.songId || '',
    viewType: state.songsReducer.viewType
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSongs,
      addSongToLibrary,
      addSongToQueue,
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
