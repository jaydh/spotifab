import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAuthCode } from '../../actions/tokenActions';
import MainView from './component';

const mapState = (state: any) => {
  return {
    signedIn: state.userReducer.signedIn
  };
};
const mapDispatch = (dispatch: any) =>
  bindActionCreators({ setAuthCode }, dispatch);
export default connect(
  mapState,
  mapDispatch
)(MainView);
