import { parse } from 'date-fns';
import * as React from 'react';
import './Song.css';

import { faYoutube } from '@fortawesome/fontawesome-free-brands';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import More from '@material-ui/icons/MoreHoriz';
import Next from '@material-ui/icons/NavigateNext';
import Play from '@material-ui/icons/PlayArrow';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';

interface IProps {
  index: number;
  song: any;
  makeNewQueueAndPlay: (index) => void;
  selected: boolean;
  addSongToQueue: (song: string) => void;
  removeSpotifySong: (song) => void;
  removeYoutubeSong: (song) => void;
  addToNext: () => void;
  sort: string;
}

interface IState {
  showOptions: boolean;
  hovered: boolean;
}

export default class extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      hovered: false
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleDouble = this.handleDouble.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }
  public render() {
    const { song, selected, makeNewQueueAndPlay, sort } = this.props;
    const currentSort = sort.substring(0, this.props.sort.indexOf('-'));
    const sortString = (s => {
      switch (s) {
        case 'artist':
          return song.track.artists && song.track.artists[0].name;
        case 'album':
          return song.track.album && song.track.album.name;
        case 'added':
          return parse(song.added_at).toLocaleDateString();
        default:
          return '';
      }
    })(currentSort);

    const detailString = (s => {
      switch (s) {
        case 'artist':
          return (
            song.track.album &&
            song.track.album.name + ' - ' + song.track.artists &&
            song.track.artists[0].name
          );
        case 'album':
          return (
            song.track.artists &&
            song.track.artists[0].name + ' - ' + song.track.album &&
            song.track.album.name
          );
        case 'added':
          return (
            song.track.artists &&
            song.track.artists[0].name + ' - ' + song.track.album &&
            song.track.album.name +
              ' - ' +
              parse(song.added_at).toLocaleDateString()
          );
        default:
          return '';
      }
    })(currentSort);

    return (
      <span
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        className={selected ? 'user-song-item selected' : 'user-song-item'}
        onDoubleClick={this.handleDouble}
      >
        <Button className="play-song btn" onClick={makeNewQueueAndPlay}>
          <Play />
        </Button>
        <p className="song-name">
          {song.youtube && <FontAwesomeIcon icon={faYoutube} />}{' '}
          {song.track.name}
        </p>
        <span className="song-buttons">
          {this.state.showOptions ? (
            <span onMouseLeave={this.toggleShow}>
              <Button className="btn" onClick={this.handleRemove(song)}>
                <Delete />
              </Button>
              <Button className="btn" onClick={this.handleAdd(song)}>
                <PlaylistAdd />
              </Button>
              <Button
                className="btn playlist-action"
                onClick={this.props.addToNext}
              >
                <Next />
              </Button>
            </span>
          ) : (
            <Button
              className="btn playlist-action"
              onMouseEnter={this.toggleShow}
            >
              <More />
            </Button>
          )}
        </span>
        <p className="song-item-details">
          {this.state.hovered ? detailString : sortString}
        </p>
      </span>
    );
  }
  private toggleShow() {
    this.setState({
      showOptions: !this.state.showOptions
    });
  }
  private handleAdd = song => () => {
    this.props.addSongToQueue(song);
  };
  private handleRemove = song => () => {
    if (song.youtube) {
      this.props.removeYoutubeSong(song.track);
    } else {
      this.props.removeSpotifySong(song.track);
    }
  };
  private handleDouble() {
    this.props.makeNewQueueAndPlay(this.props.index);
  }

  private toggleHover() {
    this.setState({ hovered: !this.state.hovered });
  }
}
