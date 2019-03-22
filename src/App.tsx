import { SnackbarProvider } from "notistack";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import "./App.css";
import MainView from "./containers/MainView";
import { loadFirebase } from "./actions/firebase";

interface IProps {
  onReset: () => void;
  loadFirebase: () => void;
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }
  async componentDidMount() {
    await this.props.loadFirebase();
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
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { onReset: () => dispatch({ type: "RESET" }), loadFirebase },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(App);
