import { parse } from 'date-fns';
import * as React from 'react';
import './Song.css';

interface IProps {
  index: number;
  song: any;
  makeNewQueueAndPlay: (index) => void;
  selected: boolean;
  updateDown: () => void;
  updateUp: () => void;
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
        <button className="play-song btn" onClick={makeNewQueueAndPlay}>
          <i className={`fas fa-play-circle play-btn`} aria-hidden="true" />
        </button>
        <p className="song-name">
          {song.youtube && <i className="fab fa-youtube" />} {song.track.name}
        </p>
        <span className="song-buttons">
          {this.state.showOptions ? (
            <span onMouseLeave={this.toggleShow}>
              <button className="btn" onClick={this.handleRemove(song)}>
                <i className="fa fa-trash" />
              </button>
              <button className="btn" onClick={this.handleAdd(song)}>
                <i className={'fa fa-plus'} aria-hidden="true" />
              </button>
              <button
                className="btn playlist-action"
                onClick={this.props.addToNext}
              >
                <i className="fa fas-external-square-ink-alt">1</i>{' '}
              </button>
            </span>
          ) : (
            <button
              className="btn playlist-action"
              onMouseEnter={this.toggleShow}
            >
              <i className="fa fa-ellipsis-h" />
            </button>
          )}

          <button className="btn" onClick={this.props.updateDown}>
            <i className={'fa fa-angle-down'} aria-hidden="true" />
          </button>
          <button className="btn" onClick={this.props.updateUp}>
            <i className={'fa fa-angle-up'} aria-hidden="true" />
          </button>
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
