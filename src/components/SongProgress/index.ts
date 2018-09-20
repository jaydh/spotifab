import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { nextSong, removeSongFromQueue } from "../../actions/queueActions";
import { seek } from "../../actions/songActions";
import SongProgress from "./component";

const mapDispatchToProps = (dispatch, getState) =>
  bindActionCreators(
    {
      nextSong,
      seek,
      removeSongFromQueue
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    nextTrackPosition: state.queue.position + 1,
    playing: state.player.playing,
    ready: state.player.spotifyReady && state.player.youtubeReady,
    currentTrack: state.queue.queue.isEmpty()
      ? null
      : state.queue.queue.get(state.queue.position),
    nextTrack: state.queue.queue.isEmpty()
      ? null
      : state.queue.queue.get(state.queue.position + 1)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongProgress);
