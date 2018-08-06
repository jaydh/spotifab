import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFilter } from '../../actions/uiActions';
import Filter from './component';

const mapDispatch = dispatch => {
  return bindActionCreators({ setFilter }, dispatch);
};

export default connect(
  null,
  mapDispatch
)(Filter);
