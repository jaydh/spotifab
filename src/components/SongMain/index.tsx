import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import {
  fetchNew,
  fetchPlaylistSongs,
  fetchRecent,
  fetchUnifiedSongs
} from '../../actions/playlistActions';
import { fetchSongs, fetchYoutubeSongs } from '../../actions/songActions';
import Component from './component';

const mapState = (state: any) => {
  return {
    firebaseLoaded: state.ui.firebaseLoaded,
    signedIn: state.userReducer.signedIn,
    enabledServices: state.userReducer.enabledServices
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSongs,
      fetchYoutubeSongs,
      fetchUnifiedSongs,
      fetchPlaylistSongs,
      fetchRecent,
      fetchNew
    },
    dispatch
  );
};

export default connect(
  mapState,
  mapDispatchToProps
)(withRouter(Component));
