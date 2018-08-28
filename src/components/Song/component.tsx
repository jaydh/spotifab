import * as React from 'react';

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
}

interface IState {
  showOptions: boolean;
}

export default class extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false
    };
    this.toggleShow = this.toggleShow.bind(this);
    this.handleDouble = this.handleDouble.bind(this);
  }
  public render() {
    const { song, selected, makeNewQueueAndPlay } = this.props;
    return (
      <div
        className={
          selected ? 'user-song-item selected-user-song-item' : 'user-song-item'
        }
        onDoubleClick={this.handleDouble}
      >
        <button className="play-song btn" onClick={makeNewQueueAndPlay}>
          <i className={`fas fa-play-circle play-btn`} aria-hidden="true" />
        </button>
        <div className="song-title">
          <p>
            {song.youtube && <i className="fab fa-youtube" />} {song.track.name}
          </p>
        </div>

        <div className="song-artist">
          <p>{song.track.artists ? song.track.artists[0].name : ''}</p>
        </div>

        <div className="song-album">
          <p>{song.track.album ? song.track.album.name : ''}</p>
        </div>
        <div className="song-buttons">
          {this.state.showOptions ? (
            <React.Fragment>
              <button className="btn" onClick={this.handleRemove(song)}>
                <i className="fa fa-trash" />
              </button>
            </React.Fragment>
          ) : (
            <button className="btn playlist-action" onClick={this.toggleShow}>
              <i className="fa fa-ellipsis-h" />
            </button>
          )}
          <button className="btn" onClick={this.handleAdd(song)}>
            <i className={'fa fa-plus'} aria-hidden="true" />
          </button>
          <button className="btn" onClick={this.props.updateDown}>
            <i className={'fa fa-angle-down'} aria-hidden="true" />
          </button>
          <button className="btn" onClick={this.props.updateUp}>
            <i className={'fa fa-angle-up'} aria-hidden="true" />
          </button>
        </div>
      </div>
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
}
