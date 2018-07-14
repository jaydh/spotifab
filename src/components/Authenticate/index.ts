import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  requestTokenRefresh,
  setAuthCode
} from '../../actions/tokenActions';
import Authenticate from './component';

const mapStateToProps = state => {
  return {
    token: state.token.token
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
