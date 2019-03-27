import { connect } from "react-redux";
import MainView from "./component";
import { withSnackbar } from "notistack";
import { setAuthCode } from "../../actions/tokenActions";
import { bindActionCreators } from "redux";

const mapState = (state: any) => {
  return {
    spotifyReady: state.player.youtubeReady,
    youtubeReady: state.player.youtubeReady,
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
