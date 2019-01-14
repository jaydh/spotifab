import { connect } from "react-redux";
import Authenticate from "./component";

const mapState = (state: any) => {
  return {
    isAnon:
      state.userReducer.firebaseUser === undefined ||
      state.userReducer.firebaseUser.isAnonymous
  };
};
export default connect(mapState)(Authenticate);
