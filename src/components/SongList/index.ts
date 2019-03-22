import { isBefore, parse } from "date-fns";
import Fuse from "fuse.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addSongToQueue,
  clearSongQueue,
  insertSongInQueue,
  makeNewQueue,
  play,
  shuffleQueue
} from "../../actions/queueActions";
import { setSongSelection } from "../../actions/uiActions";
import { addSongToLibrary } from "../../actions/userActions";
import SongList from "./component";

const mapStateToProps = (state: any, ownProps: any) => {
  const options = {
    threshold: 0.3,
    keys: [
      { name: "track.artists.name", weight: 0.5 },
      { name: "track.album.name", weight: 0.3 },
      { name: "track.name", weight: 1 }
    ]
  };
  const { songsReducer } = state;
  const { spotifyIDs, spotifyTracks, youtubeIDs, youtubeTracks } = songsReducer;

  const spotifySongs: [] = state.ui.showSpotify
    ? spotifyIDs.map((id: string) => spotifyTracks[id])
    : [];
  const youtubeSongs: [] = state.ui.showYoutube
    ? youtubeIDs.map((id: string) => youtubeTracks[id])
    : [];

  let songs = (ownProps.isLibrary
    ? [].concat(spotifySongs, youtubeSongs)
    : state.songsReducer.playlistSongs
  ).sort((a: any, b: any) => sortBy(state.ui.sort, a, b));
  const fuse = new Fuse(songs, options);
  const filter = state.ui.filter;
  songs = filter.length > 0 ? fuse.search(state.ui.filter) : songs;

  return {
    currentTrack: state.queue.queue[state.queue.position],
    songs,
    songId: state.songsReducer.songId,
    sort: state.ui.sort,
    upSelector: state.ui.upSelector,
    downSelector: state.ui.downSelector
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      addSongToLibrary,
      addSongToQueue,
      makeNewQueue,
      insertSongInQueue,
      shuffleQueue,
      clearSongQueue,
      play,
      setSongSelection
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongList);

const sortBy = (sort: string, a: any, b: any) => {
  switch (sort) {
    case "added-asc":
      return isBefore(parse(a.added_at), parse(b.added_at)) ? 1 : -1;
    case "added-desc":
      return isBefore(parse(a.added_at), parse(b.added_at)) ? -1 : 1;
    case "name-asc":
      return a.track.name
        .toLowerCase()
        .localeCompare(b.track.name.toLowerCase());
    case "name-desc":
      return b.track.name
        .toLowerCase()
        .localeCompare(a.track.name.toLowerCase());
    case "artist-asc":
      if (!a.track.artists) {
        return -1;
      }
      if (!b.track.artists) {
        return 1;
      }
      return a.track.artists[0].name
        .toLowerCase()
        .localeCompare(b.track.artists[0].name.toLowerCase());
    case "artist-desc":
      if (!a.track.artists) {
        return 1;
      }
      if (!b.track.artists) {
        return -1;
      }
      b.track.artists[0].name
        .toLowerCase()
        .localeCompare(a.track.artists[0].name.toLowerCase());
    case "album-asc":
      if (!a.track.album) {
        return -1;
      }
      if (!b.track.album) {
        return 1;
      }
      return a.track.album.name
        .toLowerCase()
        .localeCompare(b.track.album.name.toLowerCase());
    case "album-desc":
      if (!a.track.album) {
        return -1;
      }
      if (!b.track.album) {
        return 1;
      }
      return b.track.album.name
        .toLowerCase()
        .localeCompare(a.track.album.name.toLowerCase());

    default:
      return a;
  }
};
