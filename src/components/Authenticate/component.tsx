import { addMinutes, isBefore, parse } from 'date-fns';
import * as firebase from 'firebase';
import * as querystring from 'querystring';
import * as React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { ui } from '../../index';

interface IProps {
  setAuthCode: (t: string) => void;
  requestTokenRefresh: () => void;
  refetching: boolean;
  token: string;
  time: any;
  user: any;
  signedIn: boolean;
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
    if (!this.props.user) {
      const uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            return false;
          },
          uiShown: () => {
            document.getElementById('loader')!.style.display = 'none';
          },

          signInSuccessUrl: 'https://bard.jaydanhoward.com/'
        },
        signInFlow: 'redirect',
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
      };
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }
  public render() {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px'
        }}
      >
        {this.props.user ? (
          <React.Fragment>
            <div style={{ margin: 'auto', width: '100px' }}>
              {this.props.refetching && (
                <React.Fragment>
                  Connecting...
                  <i className="fa fa-refresh fa-spin" />
                </React.Fragment>
              )}
              <br />
              Signed in{' '}
              <button className="btn">
                <a href={this.redirect()}> Connect with Spotify</a>
              </button>
              {this.props.signedIn && (
                <button className="btn">
                  <NavLink to="/library">Continue</NavLink>
                </button>
              )}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div id="firebaseui-auth-container" />
            <div id="loader">Loading...</div>
            <button className="btn" onClick={this.signInAnonymously}>
              Sign in anonymously
            </button>
          </React.Fragment>
        )}
        {this.props.token &&
          isBefore(new Date(), addMinutes(parse(this.props.time), 30)) && (
            <Redirect to="/library" />
          )}
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
      ? 'http://localhost:3000/authenticate/'
      : `https://bard.jaydanhoward.com/authenticate/`;
    const url =
      'https://accounts.spotify.com/authorize/?' +
      querystring.stringify({
        response_type: 'code',
        client_id: '6d46aac55bb24239af40209109ca5cb2',
        scope: scopes,
        redirect_uri: callback
      });
    return url;
  }
}
