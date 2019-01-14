import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setAuthCode } from "../../actions/tokenActions";
import MainView from "./component";

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ setAuthCode }, dispatch);
export default connect(
  undefined,
  mapDispatch
)(MainView);
