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
    firebaseLoaded: state.ui.firebaseLoaded
  };
};

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ setAuthCode }, dispatch);

export default withSnackbar(
  connect(
    mapState,
    mapDispatch
  )(MainView)
);
