import { SnackbarProvider, withSnackbar } from "notistack";
import * as React from "react";
import { connect } from "react-redux";
import "./App.css";
import MainView from "./components/MainView";

interface IProps {
  onReset: () => void;
  signedIn: () => void;
  enqueueSnackbar: (t, options?) => void;
  spotifyReady: boolean;
  youtubeReady: boolean;
  songsSynced: boolean;
  playlistsSynced: boolean;
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    const links = [
      "https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js",
      "https://www.gstatic.com/firebasejs/5.7.2/firebase-auth.js",
      "https://www.gstatic.com/firebasejs/5.7.2/firebase-firestore.js"
    ];
    links.forEach((t: string) => {
      const script = document.createElement("script");
      script.src = t;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    });
  }

  public componentDidUpdate(oldProps: IProps) {
    const { enqueueSnackbar } = this.props;
    const options = {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      },
      variant: "success"
    };
    if (
      oldProps.spotifyReady !== this.props.spotifyReady &&
      this.props.spotifyReady
    ) {
      enqueueSnackbar("Spotify playback ready", options);
    }
    if (
      oldProps.youtubeReady !== this.props.youtubeReady &&
      this.props.youtubeReady
    ) {
      enqueueSnackbar("Youtube playback ready", options);
    }
    if (
      oldProps.songsSynced !== this.props.songsSynced &&
      this.props.songsSynced
    ) {
      enqueueSnackbar("Songs Fetched", options);
    }
    if (
      oldProps.playlistsSynced !== this.props.playlistsSynced &&
      this.props.playlistsSynced
    ) {
      enqueueSnackbar("Playlists synced", options);
    }
  }
  public render() {
    return (
      <div id="app-container">
        <MainView />
      </div>
    );
  }
  public componentDidCatch(error, info) {
    this.props.onReset();
  }
}

const mapStateToProps = state => {
  return {
    signedIn: state.userReducer.signedIn,
    youtubeReady: state.player.youtubeReady,
    spotifyReady: state.player.spotifyReady,
    songsSynced: state.synced.songsSynced,
    playlistsSynced: state.synced.playlistsSynced
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onReset: () => dispatch({ type: "RESET" })
  };
};
const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const Main = withSnackbar(Connected);

export default () => (
  <SnackbarProvider maxSnack={5}>
    <Main />
  </SnackbarProvider>
);
