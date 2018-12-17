import * as firebase from 'firebase';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { ui } from '../../firebase';

import Button from '@material-ui/core/Button';

interface IProps {
  setAuthCode: (t: string) => void;
  requestTokenRefresh: () => void;
  validToken: boolean;
  refetching: boolean;
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
    if (!this.props.signedIn) {
      const uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            return false;
          },
          uiShown: () => {
            document.getElementById('loader')!.style.display = 'none';
          },

          signInSuccessUrl: `https://${window.location.host}/`
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
        {!this.props.signedIn ? (
          <React.Fragment>
            <div id="firebaseui-auth-container" />
            <div id="loader">Loading...</div>
            <Button className="btn" onClick={this.signInAnonymously}>
              Sign in anonymously
            </Button>
          </React.Fragment>
        ) : (
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
}
