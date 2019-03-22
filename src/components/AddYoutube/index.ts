import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addSpotifySong, addYoutubeSong } from '../../actions/songActions';
import Component from './component';

const mapState = (state: any) => {
  return {
    accessToken: state.token.token,
    enabled: state.userReducer.youtubeEnabled
  };
};

const mapDispatch = (dispatch: any) => {
  return bindActionCreators({ addYoutubeSong, addSpotifySong }, dispatch);
};

export default connect(
  mapState,
  mapDispatch
)(Component);
