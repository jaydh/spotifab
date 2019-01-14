import { Button, Fade } from "@material-ui/core";
import * as React from "react";
import { auth, provider } from "../../firebase";

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
    auth.signInWithRedirect(provider);
  }
}
