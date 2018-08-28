import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchNew,
  fetchPlaylistSongs,
  fetchRecent
} from '../../actions/playlistActions';
import { fetchSongs, fetchYoutubeSongs } from '../../actions/songActions';
import Component from './component';

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchSongs,
      fetchYoutubeSongs,
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
