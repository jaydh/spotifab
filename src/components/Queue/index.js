import SongList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updatePosition,
  shuffleQueue,
  toggleRepeat,
  removeSongFromQueue,
  clearSongQueue,
  insertSongInQueue
} from '../../actions/queueActions';
import { nextSong, prevSong, togglePlay } from '../../actions/songActions';
import { addSongToLibrary } from '../../actions/userActions';
import { createNewPlaylist } from '../../actions/playlistActions';

const mapStateToProps = state => {
  return {
    songs: state.queue.queue,
    position: state.queue.position,
    repeat: state.player.repeat
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addSongToLibrary,
      updatePosition,
      shuffleQueue,
      toggleRepeat,
      removeSongFromQueue,
      clearSongQueue,
      createNewPlaylist,
      insertSongInQueue
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);
