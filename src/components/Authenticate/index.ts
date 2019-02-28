import { connect } from "react-redux";
import Authenticate from "./component";

const mapState = (state: any) => {
  return {
    isAnon: state.userReducer.user.isAnonymous
  };
};
export default connect(mapState)(Authenticate);
