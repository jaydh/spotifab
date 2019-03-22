import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { convertPlaylistToUnified } from '../../actions/playlistActions';
import { makeNewQueue } from '../../actions/queueActions';
import { setSort } from '../../actions/uiActions';
import component from './component';
import { updateVolume } from '../../actions/soundActions';

const addSelected = () => {
  return (dispatch: any, getState: any) => {
    const { selectedSongs } = getState().ui;
    dispatch({ type: 'ADD_SELECTED_TO_QUEUE', selectedSongs });
    dispatch(clearSelection());
  };
};

const makeQueueFromSelection = () => {
  return (dispatch: any, getState: any) => {
    const { selectedSongs } = getState().ui;
    dispatch(makeNewQueue(selectedSongs));
    dispatch(clearSelection());
  };
};

const clearSelection = () => {
  return { type: 'CLEAR_SELECTION' };
};

const mapStateToProps = (state: any) => {
  return {
    selection: state.ui.upSelector && state.ui.downSelector,
    currentTrack: state.queue.queue[state.queue.position],
  };
};

const mapDispatch = (dispatch: any) => {
  return bindActionCreators(
    {
      addSelected,
      clearSelection,
      makeQueueFromSelection,
      setSort,
      convertPlaylistToUnified,
      onSideOpen: () => dispatch({ type: 'OPEN_SIDE_MENU' }),
      onQueueOpen: () => dispatch({ type: 'OPEN_QUEUE' }),
      updateVolume
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(component);
