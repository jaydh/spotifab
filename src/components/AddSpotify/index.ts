import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addSpotifySong } from '../../actions/songActions';
import Component from './component';

const mapState = (state: any) => {
  return {
    accessToken: state.token.token,
    enabled: state.userReducer.spotifyEnabled
  };
};

const mapDispatch = (dispatch: any) =>
  bindActionCreators({ addSpotifySong }, dispatch);

export default connect(
  mapState,
  mapDispatch
)(Component);
