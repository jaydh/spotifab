import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addSongToQueue } from '../../actions/queueActions';
import {
  removeSpotifySong,
  removeYoutubeSong
} from '../../actions/songActions';
import SongList from './component';

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addSongToQueue,
      removeSpotifySong,
      removeYoutubeSong
    },
    dispatch
  );
};
export default connect(
  null,
  mapDispatchToProps
)(SongList);
