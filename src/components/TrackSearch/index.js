import TrackSearch from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addYoutubeSong } from '../../actions/songActions';

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addYoutubeSong
    },
    dispatch
  );
};
export default connect(
  null,
  mapDispatchToProps
)(TrackSearch);
