import { Button, Fade } from "@material-ui/core";
import * as React from "react";

interface IProps {
  isAnon: boolean;
}

export default class Authenticat extends React.Component<IProps> {
  public render() {
    const { isAnon } = this.props;
    return (
      <Fade in={isAnon}>
        <Button onClick={this.signIn}>Sign in </Button>
      </Fade>
    );
  }
  private signIn() {
    const { auth } = (window as any).firebase;
    const provider = new auth.GoogleAuthProvider();
    auth().signInWithRedirect(provider);
  }
}
