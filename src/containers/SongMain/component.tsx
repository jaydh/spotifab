import * as React from "react";
import loader from "../../helpers/loader";
import MainBar from "../MainBar";
const SongList = loader(() => import("../../components/SongList"));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  fetchPlaylistSongs: (owner: string, id: string) => void;
  fetchUnifiedSongs: (ownder: string, id: string) => void;
  fetchNew: () => void;
  fetchRecent: () => void;
  initSpotify: () => void;
  initYoutube: () => void;
  location: any;
  match: any;
  signedIn: boolean;
  firebaseLoaded: boolean;
}

class SongMain extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.initYoutube();
    this.props.initSpotify();
  }

  public componentDidUpdate(oldProps: IProps) {
    const { location, firebaseLoaded } = this.props;
    if (
      (firebaseLoaded && oldProps.firebaseLoaded !== firebaseLoaded) ||
      oldProps.location.pathname !== location.pathname
    ) {
      this.handleFetch();
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

  private handleFetch = () => {
    const {
      location,
      match,
      fetchPlaylistSongs,
      fetchUnifiedSongs,
      fetchSongs,
      fetchYoutubeSongs,
      fetchRecent,
      fetchNew
    } = this.props;
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
  };
}

export default SongMain;
