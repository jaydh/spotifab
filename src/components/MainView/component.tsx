import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import SongMain from '../SongMain';

interface IProps {
  setAuthCode: (code: string) => void;
  enqueueSnackbar: (t: any, options?: any) => void;
  spotifyReady: boolean;
  youtubeReady: boolean;
  songsSynced: boolean;
  playlistsSynced: boolean;
}

const toLibrary = () => <Redirect to="/library" />;

class MainView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const code = this.getQueryVariable('code');
    if (code.length > 0) {
      this.props.setAuthCode(code);
    }
  }

  public componentDidUpdate(oldProps: IProps) {
    const { enqueueSnackbar } = this.props;
    const options = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      variant: 'success'
    };
    console.log(this.props);
    if (
      oldProps.spotifyReady !== this.props.spotifyReady &&
      this.props.spotifyReady
    ) {
      enqueueSnackbar('Spotify playback ready', options);
    }
    if (
      oldProps.youtubeReady !== this.props.youtubeReady &&
      this.props.youtubeReady
    ) {
      enqueueSnackbar('Youtube playback ready', options);
    }
    if (
      oldProps.songsSynced !== this.props.songsSynced &&
      this.props.songsSynced
    ) {
      enqueueSnackbar('Songs Fetched', options);
    }
    if (
      oldProps.playlistsSynced !== this.props.playlistsSynced &&
      this.props.playlistsSynced
    ) {
      enqueueSnackbar('Playlists synced', options);
    }
  }

  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={toLibrary} />
          <Route path="/library" component={SongMain} />
          <Route path="/recent" component={SongMain} />
          <Route path="/new" component={SongMain} />
          <Route path="/playlist/:type/:owner/:id" component={SongMain} />
        </Switch>
      </BrowserRouter>
    );
  }

  private getQueryVariable(variable: string) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (const i of vars) {
      const pair = i.split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return '';
  }
}

export default MainView;
