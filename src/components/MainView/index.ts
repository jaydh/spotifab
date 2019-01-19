import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setAuthCode } from "../../actions/tokenActions";
import MainView from "./component";
import { withSnackbar } from "notistack";

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ setAuthCode }, dispatch);
export default withSnackbar(
  connect(
    undefined,
    mapDispatch
  )(MainView)
);
