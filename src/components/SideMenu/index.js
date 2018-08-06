import SideMenu from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSongs, fetchRecentlyPlayed } from '../../actions/songActions';
import { fetchAlbums } from '../../actions/albumActions';
import { fetchFeatured } from '../../actions/browseActions';

const mapStateToProps = state => {
  return {
    userId: state.userReducer.user ? state.userReducer.user.id : '',
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchRecentlyPlayed,
      fetchSongs,
      fetchAlbums,
      fetchFeatured,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
