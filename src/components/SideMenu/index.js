import SideMenu from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSongs, fetchRecentlyPlayed } from '../../actions/songActions';
import { fetchAlbums } from '../../actions/albumActions';
import { fetchFeatured } from '../../actions/browseActions';
import { withRouter } from 'react-router';

const mapStateToProps = state => {
  return {
    userId: state.userReducer.user ? state.userReducer.user.id : ''
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SideMenu));
