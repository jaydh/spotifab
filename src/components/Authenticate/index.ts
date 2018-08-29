import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestTokenRefresh, setAuthCode } from '../../actions/tokenActions';
import Authenticate from './component';

const mapStateToProps = state => {
  return {
    validToken: state.token.valid,
    refetching: state.token.refetching,
    signedIn: state.userReducer.signedIn
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setAuthCode,
      requestTokenRefresh
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Authenticate);
