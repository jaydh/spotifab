import BrowseView from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchPlaylistSongs,
  addPlaylistItem
} from '../../actions/playlistActions';

const mapStateToProps = state => {
  return {
    view: state.browseReducer.view,
    viewType: state.songsReducer.viewType
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchPlaylistSongs,
      addPlaylistItem
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseView);
