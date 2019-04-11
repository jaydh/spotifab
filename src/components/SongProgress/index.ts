import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { nextSong, prevSong } from "../../actions/queueActions";
import { seek } from "../../actions/songActions";
import SongProgress from "./component";

import { withStyles } from "@material-ui/core/styles";

const mapDispatchToProps = (dispatch: any, getState: any) =>
  bindActionCreators(
    {
      nextSong,
      prevSong,
      seek
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
    playing: player.playing,
    ready,
    currentTrack: state.queue.queue[state.queue.position]
  };
};

const styles = (theme: any) => ({
  appBar: {
    top: "auto",
    bottom: 0
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SongProgress));
