import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SongControls from './component';
import { nextSong, prevSong, togglePlay } from '../../actions/queueActions';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      nextSong,
      prevSong,
      togglePlay
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    playing: state.player.playing,
    ready: state.player.spotifyReady && state.player.youtubeReady,
    currentTrack: state.queue.queue.get(state.queue.position)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
