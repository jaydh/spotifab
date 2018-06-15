import SongList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { seekForward } from '../../actions/queueActions';
import { addSongToLibrary } from '../../actions/userActions';

const mapStateToProps = state => {
  return {
    songs: state.player.queue,
    currentTrack: state.player.currentTrack,
    viewType: state.songsReducer.viewType
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addSongToLibrary,
      seekForward
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);
