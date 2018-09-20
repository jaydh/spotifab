import { Line } from "rc-progress";
import * as React from "react";
import SongControls from "../SongControls";
import VolumeControls from "../VolumeControls";
import "./songProcess.css";

interface IState {
  position: number;
  seekTime: number;
  seekString: string;
}
interface IProps {
  nextSong: () => void;
  prevSong: () => void;
  togglePlay: () => void;
  seek: (t: number) => void;
  removeSongFromQueue: (position: number) => void;
  nextTrackPosition: number;
  playing: boolean;
  currentTrack: any;
  nextTrack: any;
  ready: boolean;
}

export default class SongProgress extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      seekTime: 0,
      seekString: "0:00"
    };
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.removeNext = this.removeNext.bind(this);
  }
  public async componentDidMount() {
    this.calculateTime();
  }

  public componentWillUnmount() {
    clearInterval((this as any).intervalId);
  }

  public render() {
    const { currentTrack } = this.props;
    const { duration_ms } = currentTrack ? currentTrack.track : 0;
    return (
      <div id="song-progress-container">
        {this.props.currentTrack && (
          <div className="song-details">
            <p className="song-name">{this.props.currentTrack.track.name}</p>
            <p className="artist-name">
              {this.props.currentTrack.track.artists &&
                this.props.currentTrack.track.artists[0].name}
            </p>
          </div>
        )}
        <div className="song-controls-container">
          <p>{this.millisToMinutesAndSeconds(this.state.position)}</p>
          <SongControls />
          <p>{this.millisToMinutesAndSeconds(duration_ms)}</p>
          <div className="progress-right">
            {this.props.nextTrack && (
              <>
                <button className="btn next-song" onClick={this.props.nextSong}>
                  <i className="fa fa-sm fa-chevron-right" />{" "}
                  {this.props.nextTrack.track.name}
                </button>{" "}
                <button className="btn" onClick={this.removeNext}>
                  <i className="fa fa-sm fa-minus" />
                </button>
              </>
            )}
            <VolumeControls />
          </div>
        </div>

        <div id="line-container">
          <Line
            percent={
              !isNaN(this.state.position / duration_ms)
                ? (this.state.position / duration_ms) * 100
                : 0
            }
            strokeWidth="0.6"
            trailWidth="0.3"
            strokeColor="#252627"
            onClick={this.handleClick}
            onMouseMove={this.handleHover}
          />
        </div>
      </div>
    );
  }

  private handleClick(e: any) {
    this.props.seek(this.state.seekTime);
  }

  private handleHover(e: any) {
    const t = document.getElementById("line-container");
    const percentage = e.clientX / t!.scrollWidth;
    const { currentTrack } = this.props;

    if (currentTrack) {
      const { duration_ms } = currentTrack.track;
      this.setState({
        seekTime: duration_ms * percentage,
        seekString: this.millisToMinutesAndSeconds(duration_ms * percentage)
      });
    }
  }

  private removeNext() {
    this.props.removeSongFromQueue(this.props.nextTrackPosition);
  }

  private millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.round(millis / 60000);
    const seconds = Math.round((millis % 60000) / 1000);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  private calculateTime() {
    (this as any).intervalId = setInterval(async () => {
      const { currentTrack, ready } = this.props;

      if (currentTrack && ready) {
        const { duration_ms } = currentTrack.track;
        const position = currentTrack.youtube
          ? (await (window as any).ytPlayer.getCurrentTime()) * 1000
          : (await (window as any).player.getCurrentState())
            ? (await (window as any).player.getCurrentState()).position
            : 0;
        if (position && duration_ms - position < 1000) {
          this.props.nextSong();
        }
        this.setState({
          position
        });
      }
    }, 200) as any;
  }
}
