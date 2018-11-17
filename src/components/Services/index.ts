import { connect } from 'react-redux';
import Component from './Component';
const mapStateToProps = (state: any) => {
  return {
    services: state.userReducer.enabledServices,
    spotifyValid: state.token.valid
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onToggle: (t: string) => () =>
      dispatch({ type: 'TOGGLE_SERVICE', service: t })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
