import * as React from 'react';
import asyncComponent from '../AsyncComponent';

const SongList = asyncComponent(() => import('../SongList'));
const Queue = asyncComponent(() => import('../Queue'));
const SongProgress = asyncComponent(() => import('../SongProgress'));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  fetchPlaylistSongs: (owner: string, id: string) => void;
  fetchUnifiedSongs: (ownder: string, id: string) => void;
  fetchNew: () => void;
  fetchRecent: () => void;
  location: any;
  match: any;
}

export default class SongMain extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.handleFetch = this.handleFetch.bind(this);
  }
  public componentDidMount() {
    this.handleFetch(this.props);
  }
  public componentDidUpdate(prevProps) {
    this.handleFetch(this.props, prevProps);
  }
  public render() {
    return (
      <div className="main-view">
        <SongList isLibrary={this.props.location.pathname === '/library'} />
        <Queue />
        <SongProgress />
      </div>
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
      } else if (match.params.type === 'unified') {
        fetchUnifiedSongs(match.params.owner, match.params.id);
      } else if (location.pathname === '/recent') {
        fetchRecent();
      } else if (location.pathname === '/new') {
        fetchNew();
      }
    }
  }
}
