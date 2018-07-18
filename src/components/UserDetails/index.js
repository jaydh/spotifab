import UserDetails from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../../actions/userActions';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUser
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    displayName: state.userReducer.user
      ? state.userReducer.user.display_name
      : '',
    userImage:
      state.userReducer.user &&
      state.userReducer.user.images &&
      state.userReducer.user.images[0]
        ? state.userReducer.user.images[0].url
        : ''
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetails);
