import * as React from 'react';
import { bindActionCreators } from 'redux';
import { setToken } from './actions/tokenActions';
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
        {(!token || !isBefore(new Date(), addMinutes(time, 30))) && (
          <Redirect to="/authenticate" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token.token,
    time: state.token.time,
    signedIn: state.userReducer.signedIn
  };
};
export default connect(mapStateToProps)(App);
