import * as React from "react";
import SongMain from "../../containers/SongMain";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";

interface IProps {
  enqueueSnackbar: (t: any, options?: any) => void;
  spotifyReady: boolean;
  youtubeReady: boolean;
  setAuthCode: (code: string) => void;
}

const toLibrary = () => <Redirect to="/library" />;

class MainView extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
    const authCode = this.getQueryVariable("code");
    authCode.length > 0 && props.setAuthCode(authCode);
  }

  public componentDidUpdate(oldProps: IProps) {
    const { spotifyReady, youtubeReady } = this.props;

    if (oldProps.spotifyReady !== spotifyReady && spotifyReady) {
      this.snackBar("Spotify playback ready");
    }
    if (oldProps.youtubeReady !== youtubeReady && youtubeReady) {
      this.snackBar("Youtube playback ready");
    }
  }

  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/library" component={SongMain} />
          <Route path="/recent" component={SongMain} />
          <Route path="/new" component={SongMain} />
          <Route path="/playlist/:type/:id" component={SongMain} />
          <Route path="/album/:id" component={SongMain} />
          <Route path="/artist/:id" component={SongMain} />
          <Route exact={true} path="/" component={toLibrary} />
        </Switch>
      </BrowserRouter>
    );
  }
  private snackBar = (t: string) =>
    this.props.enqueueSnackbar(t, {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      },
      variant: "success"
    });

  private getQueryVariable = (variable: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (const i of vars) {
      const pair = i.split("=");
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return "";
  };
}

export default MainView;
