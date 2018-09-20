import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { seek } from "../../actions/songActions";
import SongProgress from "./component";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      seek
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
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
