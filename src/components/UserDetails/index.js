import UserDetails from "./component";
import { connect } from "react-redux";

const mapStateToProps = state => {
  const { userReducer } = state;
  const { user } = userReducer;
  return {
    displayName: user.displayName,
    userImage:
      user.providerData && user.providerData[0]
        ? user.providerData[0].photoURL
        : user.photoURL
  };
};

export default connect(mapStateToProps)(UserDetails);
