import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  nextSong,
  prevSong,
  removeSongFromQueue,
  togglePlay
} from "../../actions/queueActions";
import SongControls from "./component";

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      nextSong,
      prevSong,
      togglePlay,
      removeSongFromQueue
    },
    dispatch
  );

const mapStateToProps = (state: any) => {
  const { userReducer, player } = state;
  let ready = true;
  if (userReducer.spotifyEnabled && !player.spotifyReady) {
    ready = false;
  }
  if (userReducer.youtubeEnabled && !player.youtubeReady) {
    ready = false;
  }

  return {
    nextTrackPosition: state.queue.position + 1,
    currentTrack:
      state.queue.queue.length === 0
        ? null
        : state.queue.queue[state.queue.position],
    nextTrack:
      state.queue.queue.length === 0
        ? null
        : state.queue.queue[state.queue.position + 1],
    prevTrack:
      state.queue.queue.length === 0
        ? null
        : state.queue.queue[state.queue.position - 1],
    ready,
    playing: state.player.playing
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
