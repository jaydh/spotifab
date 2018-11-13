import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { nextSong, prevSong } from '../../actions/queueActions';
import { seek } from '../../actions/songActions';
import SongProgress from './component';

import { withStyles } from '@material-ui/core/styles';

const mapDispatchToProps = (dispatch, getState) =>
  bindActionCreators(
    {
      nextSong,
      prevSong,
      seek
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

const styles = theme => ({
  appBar: {
    top: 'auto',
    bottom: 0
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SongProgress));
