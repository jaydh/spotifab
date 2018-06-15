import SongControls from './component';
import { connect } from 'react-redux';
import { nextSong, prevSong } from '../../actions/songActions';
import { bindActionCreators } from 'redux';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      nextSong,
      prevSong
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    songQueue: state.songQueue,
    songName: state.songsReducer.songDetails
      ? state.songsReducer.songDetails.name
      : '',
    artistName: state.songsReducer.songDetails
      ? state.songsReducer.songDetails.artists[0].name
      : '',
    songPlaying: state.songsReducer.songPlaying,
    timeElapsed: state.songsReducer.timeElapsed,
    songPaused: state.songsReducer.songPaused,
    songDetails: state.songsReducer.songDetails,
    songs: state.songsReducer.songs
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
