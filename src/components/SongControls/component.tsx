import * as React from "react";
import "./SongControls.css";

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
            className={
              ready ? "playback-btn btn" : "playback-btn fa-disabled btn"
            }
            disabled={!ready}
          >
            {this.props.prevTrack && (
              <>
                {this.props.prevTrack.track.name}
                <i
                  className="fa fa-sm fa-step-backward reverse"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </div>
        {this.props.currentTrack && this.props.currentTrack.track.name}
        <button
          onClick={this.togglePlay}
          className={
            ready
              ? "playback-btn play btn"
              : "plackback-btn play fa-disabled btn"
          }
          disabled={!ready}
        >
          <i
            className={
              this.props.playing ? "fa fa-2x fa-pause" : "fa fa-2x fa-play"
            }
            aria-hidden="true"
          />
        </button>
        {this.props.currentTrack &&
          this.props.currentTrack.track.artists &&
          this.props.currentTrack.track.artists[0].name}
        <div className="forward">
          <button
            className={
              ready ? "playback-btn  btn" : "playback-btn fa-disabled btn"
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
                {this.props.nextTrack.track.name}
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
