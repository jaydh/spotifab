import AlbumList from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateHeaderTitle } from '../../actions/uiActions';

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateHeaderTitle
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(AlbumList);
