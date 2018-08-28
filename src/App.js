import * as React from 'react';
import { bindActionCreators } from 'redux';
import { fetchUser } from './actions/userActions';
import { addMinutes, isBefore } from 'date-fns';
import './App.css';
import { Redirect } from 'react-router-dom';
import MainView from './components/MainView';
import SideMenu from './components/SideMenu';
import UserPlaylists from './components/UserPlaylists';
import { connect } from 'react-redux';

class App extends React.Component {
  render() {
    const { token, signedIn, time } = this.props;
    return (
      <div id="app-container">
        <React.Fragment>
          <SideMenu />
          <main id="page-wrap">
            <MainView />
          </main>
        </React.Fragment>
      </div>
    );
  }
  componentDidCatch(error, info) {
    this.props.onReset();
  }
}

const mapStateToProps = state => {
  return {
    token: state.token.token,
    time: state.token.time,
    signedIn: state.userReducer.signedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onReset: () => dispatch({ type: 'RESET' })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
