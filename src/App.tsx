import { SnackbarProvider } from "notistack";
import * as React from "react";
import { connect } from "react-redux";
import "./App.css";
import MainView from "./components/MainView";
import firebase from "./firebase";

interface IProps {
  onReset: () => void;
  onFirebaseLoad: () => void;
  signedIn: () => void;
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.loadFirebase = this.loadFirebase.bind(this);
  }

  public componentDidMount() {
    this.loadFirebase();
  }
  public render() {
    return (
      <SnackbarProvider maxSnack={5}>
        <div id="app-container">
          <MainView />
        </div>
      </SnackbarProvider>
    );
  }
  public componentDidCatch(error: any, info: any) {
    this.props.onReset();
  }

  private loadFirebase() {
    const main = document.createElement("script");
    main.src = "https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js";
    main.async = true;
    main.defer = true;
    main.onload = () => {
      const links = [
        "https://www.gstatic.com/firebasejs/5.7.2/firebase-auth.js",
        "https://www.gstatic.com/firebasejs/5.7.2/firebase-firestore.js"
      ];
      const promises = links.map((t: string) => {
        return new Promise((resolve: any, reject: any) => {
          const script = document.createElement("script");
          script.src = t;
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.body.appendChild(script);
        });
      });
      Promise.all(promises).then(() => {
        firebase();
        this.props.onFirebaseLoad();
      });
    };
    document.body.appendChild(main);
  }
}

const mapStateToProps = (state: any) => {
  return {
    signedIn: state.userReducer.signedIn,
    youtubeReady: state.player.youtubeReady,
    spotifyReady: state.player.spotifyReady
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onFirebaseLoad: () => dispatch({ type: "FIREBASE_LOADED" }),
    onReset: () => dispatch({ type: "RESET" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
