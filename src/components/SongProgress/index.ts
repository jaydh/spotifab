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
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  paper: {
    paddingBottom: 50
  },
  list: {
    marginBottom: theme.spacing.unit * 2
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    top: 'auto',
    bottom: 0
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto'
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SongProgress));
