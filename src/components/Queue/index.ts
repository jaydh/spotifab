import Queue from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  shuffleQueue,
  toggleRepeat,
  removeSongFromQueue,
  clearSongQueue,
  insertSongInQueue
} from "../../actions/queueActions";
import { addUnifiedPlaylist } from "../../actions/playlistActions";

const mapStateToProps = (state: any) => {
  return {
    open: state.ui.queueOpen,
    songs: state.queue.queue,
    position: state.queue.position,
    repeatOn: state.queue.repeat,
    youtubeReady: state.player.youtubeReady
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      shuffleQueue,
      toggleRepeat,
      clearSongQueue,
      addUnifiedPlaylist,
      removeSongFromQueue,
      insertSongInQueue,
      onQueueClose: () => dispatch({ type: "CLOSE_QUEUE" })
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Queue);
