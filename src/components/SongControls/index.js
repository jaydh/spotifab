import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SongControls from './component';
import { nextSong, prevSong, togglePlay } from '../../actions/queueActions';

const mapStateToProps = state => {
  return {
    currentTrack: state.queue.queue.get(state.queue.position)
  };
};

export default connect(mapStateToProps)(SongControls);
