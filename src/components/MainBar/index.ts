import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { convertPlaylistToUnified } from '../../actions/playlistActions';
import { makeNewQueue } from '../../actions/queueActions';
import { setSort } from '../../actions/uiActions';
import component from './component';

const addSelected = () => {
  return (dispatch, getState) => {
    const { selectedSongs } = getState().ui;
    return dispatch({ type: 'ADD_SELECTED_TO_QUEUE', selectedSongs });
  };
};

const makeQueueFromSelection = () => {
  return (dispatch, getState) => {
    const { selectedSongs } = getState().ui;
    return dispatch(makeNewQueue(selectedSongs));
  };
};

const clearSelection = () => {
  return { type: 'CLEAR_SELECTION' };
};

const mapStateToProps = state => {
  return {
    selection: state.ui.upSelector && state.ui.downSelector,
    currentTrack: state.queue.queue.get(state.queue.position),
    pending: !state.synced.songsSynced
  };
};

const mapDispatch = dispatch => {
  return bindActionCreators(
    {
      addSelected,
      clearSelection,
      makeQueueFromSelection,
      setSort,
      convertPlaylistToUnified
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(component);
