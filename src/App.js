import * as React from 'react';
import { bindActionCreators } from 'redux';
import { setToken } from './actions/tokenActions';
import { fetchUser } from './actions/userActions';
import { push as Menu } from 'react-burger-menu';

import './App.css';
import { listenForToken, requestTokenRefresh } from './actions/tokenActions';
import ArtWork from './components/ArtWork';
import Authenticate from './components/Authenticate';
import MainView from './components/MainView';
import SideMenu from './components/SideMenu';
import UserPlaylists from './components/UserPlaylists';
import initSpotify from './initSpotifySDK';

import { connect } from 'react-redux';

class App extends React.Component {
  componentDidMount() {
    this.props.listenForToken();
    setInterval(this.props.requestTokenRefresh, 1800000);
    initSpotify();
  }
  render() {
    const tok = this.props.token;
    return (
      <div id="app-container">
        {tok ? (
          <div>
            <Menu
              width={'20%'}
              pageWrapId={'page-wrap'}
              outerContainerId={'app-container'}
            >
              <div className="left-side-section">
                <Authenticate />
                <SideMenu />
                <UserPlaylists />
                <ArtWork />
              </div>
            </Menu>
            <main id="page-wrap">
              <MainView />
            </main>
          </div>
        ) : (
          <Authenticate />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token.token
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      requestTokenRefresh,
      listenForToken
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
