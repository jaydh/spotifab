import UserPlaylists, { Playlist } from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  deleteUnifiedPlaylist,
  fetchPlaylistsMenu,
  fetchUnifiedPlaylistMenu,
  unfollowPlaylist
} from "../../actions/playlistActions";
import { withRouter } from "react-router";

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    playlistMenu: state.playlistReducer.playlistMenu,
    unifiedMenu: state.playlistReducer.unifiedMenu
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      fetchUnifiedPlaylistMenu,
      fetchPlaylistsMenu
    },
    dispatch
  );
};
const mapDispatchToProps2 = (dispatch: any) => {
  return bindActionCreators(
    {
      unfollowPlaylist,
      deleteUnifiedPlaylist
    },
    dispatch
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserPlaylists)
);

export const ConnectedPlaylist = connect(
  null,
  mapDispatchToProps2
)(Playlist);
