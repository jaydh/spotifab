import * as React from "react";
import loader from "../../helpers/loader";
import MainBar from "../MainBar";
const SongList = loader(() => import("../SongList"));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  fetchPlaylistSongs: (owner: string, id: string) => void;
  fetchUnifiedSongs: (ownder: string, id: string) => void;
  fetchNew: () => void;
  fetchRecent: () => void;
  location: any;
  match: any;
  firebaseLoaded: boolean;
  signedIn: boolean;
  songsFetched: boolean;
}

class SongMain extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.handleFetch = this.handleFetch.bind(this);
  }

  public componentDidUpdate(oldProps: IProps) {
    const { firebaseLoaded, songsFetched, location } = this.props;
    if (
      firebaseLoaded &&
      (oldProps.location.pathname !== location.pathname || !songsFetched)
    ) {
      this.handleFetch(this.props, oldProps);
    }
  }

  public render() {
    return (
      <main id="page-wrap" className="main-view">
        <MainBar />
        <SongList isLibrary={this.props.location.pathname === "/library"} />
      </main>
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
      fetchNew,
      signedIn
    } = current;
    if (location.pathname === "/library") {
      fetchSongs();
      fetchYoutubeSongs();
    } else if (match.params.type === "spotify") {
      fetchPlaylistSongs(match.params.owner, match.params.id);
    } else if (match.params.type === "unified") {
      fetchUnifiedSongs(match.params.owner, match.params.id);
    } else if (location.pathname === "/recent") {
      fetchRecent();
    } else if (location.pathname === "/new") {
      fetchNew();
    }
  }
}

export default SongMain;
