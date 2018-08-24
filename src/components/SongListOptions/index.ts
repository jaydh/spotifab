import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSort } from '../../actions/uiActions';
import component from './component';

const mapDispatch = dispatch => {
  return bindActionCreators({ setSort }, dispatch);
};

const mapStateToProps = state => {
  return {
    pending: !state.synced.songsSynced,
    currentSort: state.ui.sort
  };
};

export default connect(
  mapStateToProps,
  mapDispatch
)(component);
