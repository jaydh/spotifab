import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setSort,
  toggleShowSpotify,
  toggleShowYoutube
} from "../../actions/uiActions";
import component from "./component";

const mapStateToProps = (state: any) => {
  return {
    currentSort: state.ui.sort,
    showCompleted: state.ui.showCompleted,
    showYoutube: state.ui.showYoutube,
    showSpotify: state.ui.showSpotify
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    { setSort, toggleShowYoutube, toggleShowSpotify },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(component);
