import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addSongToNext, addSongToQueue } from "../../actions/queueActions";
import {
  removeSpotifySong,
  removeYoutubeSong
} from "../../actions/songActions";
import SongList from "./component";

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(
    {
      addSongToQueue,
      removeSpotifySong,
      removeYoutubeSong,
      addToNext: () => addSongToNext(ownProps.song)
    },
    dispatch
  );
};
export default connect(
  null,
  mapDispatchToProps
)(SongList);
