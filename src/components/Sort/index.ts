import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSort } from '../../actions/uiActions';
import Sort from './component';

const mapState = state => {
  return {
    currentSort: state.ui.sort
  };
};

const mapDispatch = dispatch => {
  return bindActionCreators({ setSort }, dispatch);
};

export default connect(
  mapState,
  mapDispatch
)(Sort);
