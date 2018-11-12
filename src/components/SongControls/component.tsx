import * as React from 'react';
import './SongControls.css';

interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
  currentTrack: any;
  nextTrack: any;
  prevTrack: any;
  ready: boolean;
  removeNext: () => void;
  removeSongFromQueue: (index) => void;
  nextTrackPosition: number;
  seek: (t: number) => void;
}

interface IState {
  showLeft: boolean;
  showRight: boolean;
}

class SongControls extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { showLeft: false, showRight: false };

    this.togglePlay = this.togglePlay.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
    this.removeNext = this.removeNext.bind(this);
    this.toggleLeft = this.toggleLeft.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
  }

  public render() {
    const { ready } = this.props;
    return (
      <>
        <div className="reverse">
          <button
            onClick={this.prevSong}
            onMouseEnter={this.toggleLeft(true)}
            onMouseLeave={this.toggleLeft(false)}
            className={
              ready ? 'playback-btn btn' : 'playback-btn fa-disabled btn'
            }
            disabled={!ready}
          >
            {this.props.prevTrack && (
              <>
                {this.state.showLeft && this.props.prevTrack.track.name}
                <i
                  className="fa fa-sm fa-step-backward reverse"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </div>
        <button
          onClick={this.togglePlay}
          className={
            ready
              ? 'playback-btn btn play-button'
              : 'plackback-btn fa-disabled btn play-button'
          }
          disabled={!ready}
        >
          <i
            className={
              this.props.playing
                ? 'play-i fa fa-2x fa-pause'
                : 'play-i fa fa-2x fa-play'
            }
            aria-hidden="true"
          />
        </button>
        <div
          className="forward"
          onMouseEnter={this.toggleRight(true)}
          onMouseLeave={this.toggleRight(false)}
        >
          <button
            className={
              ready ? 'playback-btn  btn' : 'playback-btn fa-disabled btn'
            }
            onClick={this.nextSong}
            disabled={!ready}
          >
            {this.props.nextTrack && (
              <>
                <i
                  className="fa fa-sm fa-step-forward forward"
                  aria-hidden="true"
                />
                {this.state.showRight && this.props.nextTrack.track.name}
              </>
            )}
          </button>
          {this.state.showRight && (
            <button className="btn" onClick={this.removeNext}>
              <i className="fa fa-sm fa-minus" />
            </button>
          )}
        </div>
      </>
    );
  }
  private nextSong() {
    this.props.nextSong();
  }
  private prevSong() {
    this.props.prevSong();
  }

  private togglePlay() {
    this.props.togglePlay();
  }

  private removeNext() {
    this.props.removeSongFromQueue(this.props.nextTrackPosition);
  }

  private toggleLeft = value => () => {
    this.setState({ showLeft: value });
  };

  private toggleRight = value => () => {
    this.setState({ showRight: value });
  };
}
export default SongControls;
