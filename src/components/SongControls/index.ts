import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { nextSong, prevSong, togglePlay } from "../../actions/queueActions";
import SongControls from "./component";

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
    currentTrack: state.queue.queue.get(state.queue.position),
    ready: state.player.spotifyReady && state.player.youtubeReady,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
