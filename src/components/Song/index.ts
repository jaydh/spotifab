import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addSongToNext, addSongToQueue } from "../../actions/queueActions";
import {
  removeSpotifySong,
  removeYoutubeSong
} from "../../actions/songActions";
import SongList from "./component";

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
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

const mapStateToProps = (state: any) => {
  return {
    sort: state.ui.sort
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);
