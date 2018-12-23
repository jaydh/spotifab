import { Button, Grid } from '@material-ui/core';
import * as firebase from 'firebase';
import * as React from 'react';
import { provider } from '../../firebase';

export default class Authenticat extends React.Component {
  public render() {
    return (
      <Grid container={true} alignItems="center" justify="center">
        <Button onClick={this.signIn}>Sign in </Button>
        <Button onClick={this.signInAnonymously}>Sign in anonymously</Button>
      </Grid>
    );
  }
  private signIn() {
    firebase.auth().signInWithRedirect(provider);
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
