import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SongMain from "../SongMain";

interface IProps {
  enqueueSnackbar: (t: any, options?: any) => void;
  spotifyReady: boolean;
  youtubeReady: boolean;
  songsSynced: boolean;
  firebaseLoaded: boolean;
  playlistsSynced: boolean;
  loadFirebase: () => void;
  setAuthCode: (code: string) => void;
}

interface IState {
  authCode?: string;
}

const toLibrary = () => <Redirect to="/library" />;

class MainView extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    props.loadFirebase();
    const authCode = this.getQueryVariable("code");
    this.state = { authCode: authCode.length > 0 ? authCode : undefined };
  }

  public componentDidUpdate(oldProps: IProps) {
    const {
      enqueueSnackbar,
      spotifyReady,
      youtubeReady,
      songsSynced,
      playlistsSynced,
      firebaseLoaded,
      setAuthCode
    } = this.props;
    const { authCode } = this.state;
    if (oldProps.spotifyReady !== spotifyReady && spotifyReady) {
      this.snackBar("Spotify playback ready");
    }
    if (oldProps.youtubeReady !== youtubeReady && youtubeReady) {
      this.snackBar("Youtube playback ready");
    }
    if (oldProps.songsSynced !== songsSynced && songsSynced) {
      this.snackBar("Songs Fetched");
    }
    if (oldProps.playlistsSynced !== playlistsSynced && playlistsSynced) {
      this.snackBar("Playlists synced");
    }
    if (
      oldProps.firebaseLoaded !== this.props.firebaseLoaded &&
      this.props.firebaseLoaded
    ) {
      this.snackBar("Firebase Loaded");
      if (authCode) {
        this.props.setAuthCode(authCode);
      }
    }
  }

  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/library" component={SongMain} />
          <Route path="/recent" component={SongMain} />
          <Route path="/new" component={SongMain} />
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
