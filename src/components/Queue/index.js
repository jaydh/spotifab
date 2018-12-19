import SongList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updatePosition,
  play,
  shuffleQueue,
  toggleRepeat,
  removeSongFromQueue,
  clearSongQueue,
  insertSongInQueue
} from '../../actions/queueActions';
import { nextSong, prevSong, togglePlay } from '../../actions/songActions';
import { addSongToLibrary } from '../../actions/userActions';
import { addUnifiedPlaylist } from '../../actions/playlistActions';

const mapStateToProps = state => {
  return {
    songs: state.queue.queue,
    position: state.queue.position,
    repeatOn: state.queue.repeat,
    youtubeReady: state.player.youtubeReady
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      shuffleQueue,
      toggleRepeat,
      clearSongQueue,
      addUnifiedPlaylist,
      removeSongFromQueue,
      insertSongInQueue
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);
