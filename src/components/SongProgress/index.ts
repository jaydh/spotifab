import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { seek } from '../../actions/songActions';
import SongProgress from './component';

const mapDispatchtoProps = dispatch => {
  return bindActionCreators(
    {
      seek
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    currentTrack: state.queue.queue.isEmpty()
      ? null
      : state.queue.queue.get(state.queue.position).track,
    playing: state.player.playing
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(SongProgress);
