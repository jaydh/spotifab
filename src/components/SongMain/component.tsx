import * as React from 'react';
import asyncComponent from '../AsyncComponent';

const SongList = asyncComponent(() => import('../SongList'));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  fetchPlaylistSongs: (owner: string, id: string) => void;
  fetchUnifiedSongs: (ownder: string, id: string) => void;
  fetchNew: () => void;
  fetchRecent: () => void;
  location: any;
  match: any;
  enqueueSnackbar: (t, options?) => void;
  spotifyReady: boolean;
  youtubeReady: boolean;
}

interface IState {
  playlistId?: string;
  isUnified?: boolean;
}

class SongMain extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { playlistId: undefined, isUnified: undefined };
    this.handleFetch = this.handleFetch.bind(this);
  }
  public componentDidMount() {
    this.handleFetch(this.props);
  }
  public componentDidUpdate(oldProps: IProps) {
    this.handleFetch(this.props, oldProps);
    const { enqueueSnackbar } = this.props;
    const options = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      variant: 'success'
    };
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
  }

  public render() {
    return (
      <React.Fragment>
        <main id="page-wrap" className="main-view">
          <SongList
            isLibrary={this.props.location.pathname === '/library'}
            playlistId={this.state.playlistId}
            isUnified={this.state.isUnified}
          />
        </main>
      </React.Fragment>
    );
  }
  private handleFetch(current: IProps, prev?: IProps) {
    const {
      location,
      match,
      fetchPlaylistSongs,
      fetchUnifiedSongs,
      fetchSongs,
      fetchYoutubeSongs,
      fetchRecent,
      fetchNew
    } = current;
    if (!prev || prev.location.pathname !== location.pathname) {
      if (location.pathname === '/library') {
        fetchSongs();
        fetchYoutubeSongs();
      } else if (match.params.type === 'spotify') {
        fetchPlaylistSongs(match.params.owner, match.params.id);
        this.setState({ playlistId: match.params.id });
        this.setState({ isUnified: false });
      } else if (match.params.type === 'unified') {
        this.setState({ isUnified: true });
        fetchUnifiedSongs(match.params.owner, match.params.id);
      } else if (location.pathname === '/recent') {
        fetchRecent();
      } else if (location.pathname === '/new') {
        fetchNew();
      }
    }
  }
}

export default SongMain;
