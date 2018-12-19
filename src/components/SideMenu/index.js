import SideMenu from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAlbums } from '../../actions/albumActions';
import { fetchFeatured } from '../../actions/browseActions';
import { withRouter } from 'react-router';

const mapStateToProps = state => {
  return {
    userId: state.userReducer.user ? state.userReducer.user.id : ''
  };
};


export default connect(
  mapStateToProps
)(withRouter(SideMenu));
