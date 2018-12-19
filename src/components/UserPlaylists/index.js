import UserPlaylists, { Playlist } from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  deleteUnifiedPlaylist,
  fetchPlaylistsMenu,
  fetchUnifiedPlaylistMenu,
  unfollowPlaylist
} from '../../actions/playlistActions';
import { withRouter } from 'react-router';

const mapStateToProps = state => {
  return {
    user: state.userReducer.user,
    playlistMenu: state.playlistReducer.playlistMenu,
    unifiedMenu: state.playlistReducer.unifiedMenu,
    synced: state.synced.playlistsSynced,
    tokenTime: state.token.time
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchUnifiedPlaylistMenu,
      fetchPlaylistsMenu
    },
    dispatch
  );
};
const mapDispatchToProps2 = dispatch => {
  return bindActionCreators(
    {
      unfollowPlaylist,
      deleteUnifiedPlaylist
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserPlaylists));

export const ConnectedPlaylist = connect(
  null,
  mapDispatchToProps2
)(Playlist);
