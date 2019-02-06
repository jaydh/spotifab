import { connect } from "react-redux";
import MainView from "./component";
import { withSnackbar } from "notistack";
import { loadFirebase } from "../../actions/firebase";
import { setAuthCode } from "../../actions/tokenActions";
import { bindActionCreators } from "redux";

const mapState = (state: any) => {
  return {
    spotifyReady: state.player.youtubeReady,
    youtubeReady: state.player.youtubeReady,
    songsSynced: state.synced.songsSynced,
    playlistsSynced: state.synced.playlistsSynced,
    firebaseLoaded: state.synced.firebaseLoaded
  };
};

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ setAuthCode, loadFirebase }, dispatch);

export default withSnackbar(
  connect(
    mapState,
    mapDispatch
  )(MainView)
);
