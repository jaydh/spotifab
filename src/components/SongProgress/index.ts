import { connect } from 'react-redux';
import SongProgress from './component';

const mapStateToProps = state => {
  return {
    currentTrack: state.queue.currentTrack,
    playing: state.player.playing
  };
};

export default connect(mapStateToProps)(SongProgress);
