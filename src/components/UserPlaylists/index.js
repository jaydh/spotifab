import UserPlaylists from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchPlaylistsMenu,
  fetchPlaylistSongs,
  unfollowPlaylist
} from '../../actions/playlistActions';

const mapStateToProps = state => {
  return {
    userId: state.userReducer.user ? state.userReducer.user.id : '',
    playlistMenu: state.playlistReducer.playlistMenu
      ? state.playlistReducer.playlistMenu
      : ''
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchPlaylistsMenu,
      fetchPlaylistSongs,
      unfollowPlaylist
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPlaylists);
