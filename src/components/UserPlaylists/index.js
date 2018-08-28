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
    user: state.userReducer.user,
    playlistMenu: state.playlistReducer.playlistMenu,
    synced: state.synced.playlistSynced,
    tokenTime: state.token.time
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchPlaylistsMenu,
      unfollowPlaylist
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPlaylists);
