import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pauseSong, play, resumeSong, stopSong } from './actions/songActions';
import { setToken } from './actions/tokenActions';
import { fetchUser } from './actions/userActions';
import { push as Menu } from 'react-burger-menu';

import './App.css';

import ArtWork from './components/ArtWork';
import Footer from './components/Footer';
import Header from './components/Header';
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

    if (!hashParams.access_token) {
      const scopes =
        'playlist-read-private playlist-read-collaborative playlist-modify-public user-read-recently-played playlist-modify-private user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
      const callback =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/callback'
          : 'https://spotifab-3379e.firebaseapp.com/callback';
      window.location.href =
        'https://accounts.spotify.com/authorize?client_id=6d46aac55bb24239af40209109ca5cb2' +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&response_type=token&redirect_uri=' +
        callback;
    } else {
      this.props.setToken(hashParams.access_token);
      initSpotify();
      this.props.fetchUser(hashParams.access_token);
    }
  }
  pauseSong = () => {
    this.props.pauseSong();
  };

  resumeSong = () => {
    this.props.resumeSong();
  };

  audioControl = song => {
    this.props.playSong(song.track);
  };

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
          <div
            style={{
              position: 'absolute',
              left: this.props.showYT ? 0 : 100000
            }}
          >
            <div id="ytPlayer" />
          </div>
          <Header />
          <MainView />
          <Footer />
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
