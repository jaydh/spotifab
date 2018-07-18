import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SongControls from './component';
import { nextSong, prevSong, togglePlay } from '../../actions/songActions';

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
    spotifyReady: state.player.spotifyReady,
    youtubeReady: state.player.youtubeReady
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
