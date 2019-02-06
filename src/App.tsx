import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import { connect } from 'react-redux';
import './App.css';
import MainView from './components/MainView';

interface IProps {
  onReset: () => void;
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    onReset: () => dispatch({ type: 'RESET' })
  };
};

export default connect(
  null,
  mapDispatchToProps
)(App);
