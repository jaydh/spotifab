import * as firebase from 'firebase';
import * as querystring from 'querystring';
import * as React from 'react';

interface IProps {
  setAuthCode: (t: string) => void;
  requestTokenRefresh: () => void;
}
export default class Authenticat extends React.Component<IProps> {
  public componentDidMount() {
    function getQueryVariable(variable) {
      const query = window.location.search.substring(1);
      const vars = query.split('&');
      for (const i of vars) {
        const pair = i.split('=');
        if (decodeURIComponent(pair[0]) === variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return '';
    }
    const code = getQueryVariable('code');
    if (code.length > 0) {
      this.props.setAuthCode(code);
    }
  }
  public render() {
    return (
      <div style={{ color: 'blue' }}>
        <button onClick={this.redirect}>Authorize with Spotify</button>
        <button onClick={this.signInAnonymously}>Sign in anonymously</button>
        <div id="firebaseui-auth-container" />
        <div id="loader">Loading...</div>
        <a href="https://firebasestorage.googleapis.com/v0/b/spotifab-3379e.appspot.com/o/spotilyrics%200.1.0.exe?alt=media&token=6db41137-2479-4eec-9a0f-fd3766c56545">
          Download Windows Desktop App
        </a>
      </div>
    );
  }

  private signInAnonymously() {
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        // Handle Errors here.
        // ...
      });
  }

  private redirect() {
    const scopes =
      'playlist-read-private playlist-read-collaborative playlist-modify-public user-read-recently-played playlist-modify-private user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
    const callback = window.location.href.startsWith('http://localhost')
      ? 'http://localhost:3000/callback'
      : `https://spotifab-3379e.firebaseapp.com/callback`;
    window.location.href =
      'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: '6d46aac55bb24239af40209109ca5cb2',
        scope: scopes,
        redirect_uri: callback
      });
  }
}
