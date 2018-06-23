import SongControls from './component';
import { connect } from 'react-redux';
import { nextSong, prevSong, togglePlay } from '../../actions/songActions';
import { bindActionCreators } from 'redux';

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
    songQueue: state.songQueue,
    songName: state.songsReducer.songDetails
      ? state.songsReducer.songDetails.name
      : '',
    artistName: state.songsReducer.songDetails
      ? state.songsReducer.songDetails.artists[0].name
      : '',
    playing: state.player.playing,
    songDetails: state.songsReducer.songDetails,
    songs: state.songsReducer.songs,
    currentTrack: state.queue.queue.get(state.queue.position).track
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
