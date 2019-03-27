import * as React from "react";
import loader from "../../helpers/loader";
import MainBar from "../MainBar";
const SongList = loader(() => import("../../components/SongList"));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  fetchPlaylistSongs: (id: string) => void;
  fetchUnifiedSongs: (id: string) => void;
  fetchAlbum: (id: string) => void;
  fetchArtist: (id: string) => void;
  fetchNew: () => void;
  fetchRecent: () => void;
  location: any;
  match: any;
}

class SongMain extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.handleFetch();
  }

  public componentDidUpdate(oldProps: IProps) {
    const { location } = this.props;
    if (oldProps.location.pathname !== location.pathname) {
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
      fetchNew,
      fetchAlbum,
      fetchArtist
    } = this.props;

    if (location.pathname === "/library") {
      fetchSongs();
      fetchYoutubeSongs();
    } else if (
      location.pathname.startsWith("/playlist") &&
      match.params.type === "spotify"
    ) {
      fetchPlaylistSongs(match.params.id);
    } else if (
      location.pathname.startsWith("/playlist") &&
      match.params.type === "unified"
    ) {
      fetchUnifiedSongs(match.params.id);
    } else if (location.pathname === "/recent") {
      fetchRecent();
    } else if (location.pathname === "/new") {
      fetchNew();
    } else if (location.pathname.startsWith("/album")) {
      fetchAlbum(match.params.id);
    } else if (location.pathname.startsWith("/artist")) {
      fetchArtist(match.params.id);
    }
  };
}

export default SongMain;
