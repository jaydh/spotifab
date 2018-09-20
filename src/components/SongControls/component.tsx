import * as React from "react";
import "./SongControls.css";

interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  playing: boolean;
  currentTrack: any;
  nextTrack: any;
  ready: boolean;
  seek: (t: number) => void;
}

class SongControls extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.togglePlay = this.togglePlay.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
  }

  public render() {
    const { ready } = this.props;
    return (
      <>
        <button
          onClick={this.prevSong}
          className={
            ready
              ? "playback-btn reverse btn"
              : "playback-btn reverse fa-disabled btn"
          }
          disabled={!ready}
        >
          <i className="fa fa-sm fa-step-backward reverse" aria-hidden="true" />
        </button>
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
        <button
          className={
            ready
              ? "playback-btn forward btn"
              : "playback-btn forward fa-disabled btn"
          }
          onClick={this.props.nextTrack}
          disabled={!ready}
        >
          <i className="fa fa-sm fa-step-forward forward" aria-hidden="true" />
        </button>
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
}
export default SongControls;
