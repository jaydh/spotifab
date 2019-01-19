import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  insertSongInQueue,
  play,
  removeSongFromQueue,
  updatePosition
} from '../../actions/queueActions';
import { addSongToLibrary } from '../../actions/userActions';
import Component from './component';

const mapStateToProps = (state: any) => {
  return {
    songSize: state.queue.queue.size,
    position: state.queue.position
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      addSongToLibrary,
      updatePosition,
      play,
      removeSongFromQueue,
      insertSongInQueue
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
