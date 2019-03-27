import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import {
  fetchArtist,
  fetchNew,
  fetchPlaylistSongs,
  fetchRecent,
  fetchUnifiedSongs,
  fetchAlbum
} from '../../actions/fetchSongs';
import { fetchSongs, fetchYoutubeSongs } from '../../actions/songActions';
import Component from './component';

const mapState = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      fetchArtist,
      fetchSongs,
      fetchYoutubeSongs,
      fetchUnifiedSongs,
      fetchPlaylistSongs,
      fetchRecent,
      fetchNew,
      fetchAlbum
    },
    dispatch
  );
};

export default withRouter(
  connect(
    mapState,
    mapDispatchToProps
  )(Component)
);
