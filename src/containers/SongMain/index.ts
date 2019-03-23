import { connect } from "react-redux";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import {
  fetchNew,
  fetchPlaylistSongs,
  fetchRecent,
  fetchUnifiedSongs
} from "../../actions/playlistActions";
import { fetchSongs, fetchYoutubeSongs } from "../../actions/songActions";
import Component from "./component";

const mapState = (state: any) => {
  return {
    firebaseLoaded: state.ui.firebaseLoaded
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      fetchSongs,
      fetchYoutubeSongs,
      fetchUnifiedSongs,
      fetchPlaylistSongs,
      fetchRecent,
      fetchNew,
      initSpotify: () => dispatch({ type: "INIT_SPOTIFY_REQUESTED" }),
      initYoutube: () => dispatch({ type: "INIT_YOUTUBE_REQUESTED" })
    },
    dispatch
  );
};

export default withRouter(
  connect(
    mapState,
    mapDispatchToProps
  )(Component)
);
