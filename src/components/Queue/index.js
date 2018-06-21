import SongList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  seekForward,
  shuffleQueue,
  toggleRepeat
} from '../../actions/queueActions';
import { addSongToLibrary } from '../../actions/userActions';

const mapStateToProps = state => {
  return {
    songs: state.player.queue,
    currentTrack: state.player.currentTrack,
    viewType: state.songsReducer.viewType,
    repeat: state.player.repeat
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addSongToLibrary,
      seekForward,
      shuffleQueue,
      toggleRepeat
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);
