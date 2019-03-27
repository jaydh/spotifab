import { connect } from 'react-redux';
import SongControls from './component';
import { Dispatch, bindActionCreators } from 'redux';
import { addSpotifySong, addYoutubeSong } from '../../actions/songActions';

const mapStateToProps = (state: any) => {
  const currentSong = state.queue.queue[state.queue.position];
  return {
    currentSong,
    playing: state.player.playing,
    isSaved:
      (currentSong.spotify &&
        state.songsReducer.spotifyIDs.includes(currentSong.track.id)) ||
      (currentSong.youtube &&
        state.songsReducer.youtubeIDs.includes(currentSong.track.id))
  };
};

const mapDispatch = (dispatch: Dispatch) =>
  bindActionCreators({ addSpotifySong, addYoutubeSong }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatch
)(SongControls);
