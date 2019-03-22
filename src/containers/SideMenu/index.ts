import SideMenu from './component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state: any) => {
  return {
    open: state.ui.sideMenuOpen,
    userId: state.userReducer.user ? state.userReducer.user.id : ''
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      onSideClose: () => dispatch({ type: 'CLOSE_SIDE_MENU' })
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SideMenu)
);
