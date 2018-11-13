import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { convertPlaylistToUnified } from '../../actions/playlistActions';
import { setSort } from '../../actions/uiActions';
import component from './component';

const mapDispatch = dispatch => {
  return bindActionCreators({ setSort, convertPlaylistToUnified }, dispatch);
};

const mapStateToProps = state => {
  return {
    pending: !state.synced.songsSynced,
  };
};

export default connect(
  mapStateToProps,
  mapDispatch
)(component);
