import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import component from './component';
import { clearPlaylistName } from '../../actions/playlistActions';

const mapState = (state: any) => ({ name: state.songsReducer.playlistName });

const mapDispatch = (dispatch: Dispatch) =>
  bindActionCreators({ clearPlaylistName }, dispatch);

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(component)
);
