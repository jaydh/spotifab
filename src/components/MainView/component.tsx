import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import SongMain from "../SongMain";

interface IProps {
  setAuthCode: (code) => void;
}

const toLibrary = () => <Redirect to="/library" />;

class MainView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const code = this.getQueryVariable("code");
    if (code.length > 0) {
      this.props.setAuthCode(code);
    }
  }
  public render() {
    return (
      <>
        <Switch>
          <Route exact={true} path="/" component={toLibrary} />
          <Route path="/library" component={SongMain} />
          <Route path="/recent" component={SongMain} />
          <Route path="/new" component={SongMain} />
          <Route path="/playlist/:type/:owner/:id" component={SongMain} />
        </Switch>
      </>
    );
  }

  private getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (const i of vars) {
      const pair = i.split("=");
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return "";
  }
}

export default MainView;
