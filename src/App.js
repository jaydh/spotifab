import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pauseSong, play, resumeSong, stopSong } from './actions/songActions';
import { setToken } from './actions/tokenActions';
import { fetchUser } from './actions/userActions';
import { push as Menu } from 'react-burger-menu';

import './App.css';

import ArtWork from './components/ArtWork';
import initSpotify from './initSpotifySDK';
import MainView from './components/MainView';
import SideMenu from './components/SideMenu';
import UserPlaylists from './components/UserPlaylists';

class App extends React.Component {
  constructor(props) {
    super(props);
    const hashParams: any = {};
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    let e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }

    if (this.props.token || hashParams.access_token) {
      this.props.setToken(hashParams.access_token);
      this.props.fetchUser(hashParams.access_token);
      initSpotify();
    } else {
      const scopes =
        'playlist-read-private playlist-read-collaborative playlist-modify-public user-read-recently-played playlist-modify-private user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
      const callback = `https://spotifab-3379e.firebaseapp.com/callback`;
      window.location.href =
        'https://accounts.spotify.com/authorize?client_id=6d46aac55bb24239af40209109ca5cb2' +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&response_type=token&redirect_uri=' +
        callback;
    }
  }
  render() {
    return (
      <div id="app-container">
        <Menu
          width={'20%'}
          pageWrapId={'page-wrap'}
          outerContainerId={'app-container'}
        >
          <div className="left-side-section">
            <SideMenu />
            <UserPlaylists />
            <ArtWork />
          </div>
        </Menu>
        <main id="page-wrap">
          <MainView />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.player.token
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchUser,
      setToken
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
