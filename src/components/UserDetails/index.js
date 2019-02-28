import UserDetails from "./component";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    displayName: state.userReducer.user.displayName,
    userImage: state.userReducer.user.providerData[0]
      ? state.userReducer.user.providerData[0].photoURL
      : state.userReducer.user.photoURL
  };
};

export default connect(mapStateToProps)(UserDetails);
