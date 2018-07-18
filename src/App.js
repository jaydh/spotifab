import * as React from 'react';
import { bindActionCreators } from 'redux';
import { setToken } from './actions/tokenActions';
import { fetchUser } from './actions/userActions';
import { push as Menu } from 'react-burger-menu';

import './App.css';
import { listenForToken, requestTokenRefresh } from './actions/tokenActions';
import Authenticate from './components/Authenticate';
import MainView from './components/MainView';
import SideMenu from './components/SideMenu';
import UserPlaylists from './components/UserPlaylists';
import { connect } from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.signedIn) {
      this.props.listenForToken();
    }
  }
  render() {
    const { token, signedIn } = this.props;
    return (
      <div id="app-container">
        {token && signedIn ? (
          <div>
            <Menu
              width={'20%'}
              pageWrapId={'page-wrap'}
              outerContainerId={'app-container'}
            >
              <div className="left-side-section">
                <SideMenu />
                <UserPlaylists />
                <Authenticate />
                <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/spotilyrics%200.1.0.exe?alt=media&token=6db41137-2479-4eec-9a0f-fd3766c56545">
                  Download Windows Desktop App
                </a>
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
    token: state.token.token,
    signedIn: state.userReducer.signedIn
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
