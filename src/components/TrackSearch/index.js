import TrackSearch from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchSongs } from '../../actions/songActions';

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      searchSongs
    },
    dispatch
  );
};
export default connect(
  null,
  mapDispatchToProps
)(TrackSearch);
