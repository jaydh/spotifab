import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchNew,
  fetchPlaylistSongs,
  fetchRecent,
  fetchUnifiedSongs
} from '../../actions/playlistActions';
import { fetchSongs, fetchYoutubeSongs } from '../../actions/songActions';
import Component from './component';

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
  null,
  mapDispatchToProps
)(Component);
