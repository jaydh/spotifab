import SongControls from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateVolume, toggleMute } from '../../actions/soundActions';

const mapStateToProps = state => {
  return {
    volume: state.player.volume,
    muted: state.player.muted
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateVolume,
      toggleMute
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongControls);
