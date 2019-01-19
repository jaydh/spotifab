import { connect } from 'react-redux';
import Component from './Component';
import { toggleService } from '../../actions/uiActions';
import { bindActionCreators } from 'redux';
const mapStateToProps = (state: any) => {
  return {
    youtube: state.userReducer.youtubeEnabled,
    spotify: state.userReducer.spotifyEnabled,
    soundcloud: state.userReducer.soundcloudEnabled,
    spotifyValid: state.token.valid
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ toggleService }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
